import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAuthUserFromRequest, prismaMock } = vi.hoisted(() => ({
  getAuthUserFromRequest: vi.fn(),
  prismaMock: {
    reviews: {
      findUnique: vi.fn(),
    },
    review_reports: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/shared/lib/auth", () => ({
  getAuthUserFromRequest,
}));

vi.mock("../../../../../../prisma/client", () => ({
  __esModule: true,
  default: prismaMock,
}));

import { POST } from "./route";

function createRequest(body) {
  return new Request("http://localhost/api/products/comments/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/products/comments/report", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAuthUserFromRequest.mockResolvedValue({
      id: "user-1",
      isBlocked: false,
      deletedAt: null,
    });
    prismaMock.reviews.findUnique.mockResolvedValue({
      id: 7,
      user_id: "user-2",
    });
    prismaMock.review_reports.upsert.mockResolvedValue({
      id: 1n,
      review_id: 7,
      user_id: "user-1",
      reason: "spam",
    });
  });

  it("rejects anonymous requests", async () => {
    getAuthUserFromRequest.mockResolvedValue(null);

    const response = await POST(createRequest({ reviewId: 7 }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(prismaMock.review_reports.upsert).not.toHaveBeenCalled();
  });

  it("rejects blocked accounts", async () => {
    getAuthUserFromRequest.mockResolvedValue({
      id: "user-1",
      isBlocked: true,
      deletedAt: null,
    });

    const response = await POST(createRequest({ reviewId: 7 }));

    expect(response.status).toBe(403);
    expect(prismaMock.review_reports.upsert).not.toHaveBeenCalled();
  });

  it("rejects an invalid reviewId", async () => {
    const response = await POST(createRequest({ reviewId: "abc" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "A valid reviewId is required.",
    });
    expect(prismaMock.review_reports.upsert).not.toHaveBeenCalled();
  });

  it("rejects reasons longer than 500 characters", async () => {
    const response = await POST(
      createRequest({ reviewId: 7, reason: "x".repeat(501) }),
    );

    expect(response.status).toBe(400);
    expect(prismaMock.review_reports.upsert).not.toHaveBeenCalled();
  });

  it("returns 404 for missing reviews", async () => {
    prismaMock.reviews.findUnique.mockResolvedValue(null);

    const response = await POST(createRequest({ reviewId: 999 }));

    expect(response.status).toBe(404);
    expect(prismaMock.review_reports.upsert).not.toHaveBeenCalled();
  });

  it("blocks self-reports", async () => {
    prismaMock.reviews.findUnique.mockResolvedValue({
      id: 7,
      user_id: "user-1",
    });

    const response = await POST(createRequest({ reviewId: 7 }));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "You cannot report your own review.",
    });
    expect(prismaMock.review_reports.upsert).not.toHaveBeenCalled();
  });

  it("upserts a report for a valid request", async () => {
    const response = await POST(createRequest({ reviewId: 7, reason: " spam " }));

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe(201);
    expect(body.report.id).toBe(1);
    expect(prismaMock.review_reports.upsert).toHaveBeenCalledWith({
      where: { review_id_user_id: { review_id: 7, user_id: "user-1" } },
      update: { reason: "spam" },
      create: { review_id: 7, user_id: "user-1", reason: "spam" },
    });
  });

  it("accepts an empty reason", async () => {
    const response = await POST(createRequest({ reviewId: 7 }));

    expect(response.status).toBe(200);
    expect(prismaMock.review_reports.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ reason: "" }),
      }),
    );
  });
});
