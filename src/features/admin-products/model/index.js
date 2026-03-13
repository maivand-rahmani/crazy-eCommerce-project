"use server";

import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

import {
  ADMIN_PAGE_SIZE,
  LOW_STOCK_THRESHOLD,
  buildPagination,
  groupPairs,
  isAllowedImageFile,
  normalizeOptionalBigInt,
  normalizeOptionalNumber,
  normalizeText,
  parsePage,
  safeJsonParse,
} from "@/shared/lib";

import { ensureAdminAction } from "@/features/admin-common";
import { deleteLocalUpload, saveLocalUpload } from "@/shared/lib/files";
import { revalidateLocalizedPaths } from "@/shared/lib/admin/revalidate";

const PRODUCT_BASE_INCLUDE = {
  categories: true,
  product_specs: {
    orderBy: { id: "asc" },
  },
  product_images: {
    where: { variant_id: null },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  },
  product_variants: {
    where: { deleted_at: null },
    include: {
      product_images: {
        orderBy: [{ position: "asc" }, { id: "asc" }],
      },
      variant_options: {
        orderBy: { id: "asc" },
      },
      variant_specs: {
        orderBy: { id: "asc" },
      },
    },
    orderBy: [{ updated_at: "desc" }, { id: "desc" }],
  },
};

async function syncProductCard({ tx, variantId }) {
  const variant = await tx.product_variants.findUnique({
    where: { id: variantId },
    include: {
      products: {
        include: {
          categories: true,
          product_specs: true,
        },
      },
      variant_options: true,
      variant_specs: true,
      product_images: {
        orderBy: [{ position: "asc" }, { id: "asc" }],
      },
    },
  });

  if (!variant) return;

  const product = variant.products;
  const imageUrl =
    variant.product_images[0]?.url ||
    (await tx.product_images.findFirst({
      where: { product_id: product.id, variant_id: null },
      orderBy: [{ position: "asc" }, { id: "asc" }],
    }))?.url ||
    "/icons/product-placeholder.svg";

  await tx.product_cards.upsert({
    where: { variant_id: variant.id },
    create: {
      product_id: product.id,
      variant_id: variant.id,
      product_name: product.name,
      variant_name: variant.variant_name,
      category_id: product.category_id,
      price_cents: variant.price_cents,
      stock_quantity: variant.stock_quantity,
      image_url: imageUrl,
      variant_options: variant.variant_options.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {}),
      specs: {
        product: product.product_specs.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {}),
        variant: variant.variant_specs.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {}),
      },
      is_active:
        product.deleted_at === null &&
        variant.deleted_at === null &&
        product.status === "active" &&
        variant.status === "active",
      deleted_at: product.deleted_at || variant.deleted_at || null,
    },
    update: {
      product_name: product.name,
      variant_name: variant.variant_name,
      category_id: product.category_id,
      price_cents: variant.price_cents,
      stock_quantity: variant.stock_quantity,
      image_url: imageUrl,
      variant_options: variant.variant_options.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {}),
      specs: {
        product: product.product_specs.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {}),
        variant: variant.variant_specs.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {}),
      },
      is_active:
        product.deleted_at === null &&
        variant.deleted_at === null &&
        product.status === "active" &&
        variant.status === "active",
      deleted_at: product.deleted_at || variant.deleted_at || null,
      updated_at: new Date(),
    },
  });
}

async function syncProductCardsByProductId({ tx, productId }) {
  const variants = await tx.product_variants.findMany({
    where: { product_id: productId },
    select: { id: true },
  });

  await Promise.all(variants.map((variant) => syncProductCard({ tx, variantId: variant.id })));
}

async function uploadImages(files, segments) {
  const uploaded = [];

  for (const file of files) {
    if (!isAllowedImageFile(file)) {
      throw new Error("Only JPG, PNG, and WebP images are supported.");
    }
    const url = await saveLocalUpload(file, segments);
    uploaded.push(url);
  }

  return uploaded;
}

function parseJsonArray(value) {
  return safeJsonParse(value || "[]", []);
}

function parseNumberArray(value) {
  return parseJsonArray(value).map((entry) => Number(entry)).filter(Number.isFinite);
}

export async function getAdminProductFilters() {
  const [categories, statuses] = await Promise.all([
    prisma.categories.findMany({ orderBy: { name: "asc" } }),
    Promise.resolve(["draft", "active", "archived"]),
  ]);

  return { categories: toSafeJson(categories), statuses };
}

export async function getAdminProducts(searchParams = {}) {
  await ensureAdminAction();

  const page = parsePage(searchParams.page);
  const query = normalizeText(searchParams.query);
  const status = normalizeText(searchParams.status);
  const category = normalizeOptionalNumber(searchParams.category);
  const stock = normalizeText(searchParams.stock);

  const stockWhere =
    stock === "available"
      ? {
          product_variants: {
            some: {
              deleted_at: null,
              stock_quantity: { gt: 0 },
            },
          },
        }
      : stock === "out"
        ? {
            product_variants: {
              none: {
                deleted_at: null,
                stock_quantity: { gt: 0 },
              },
            },
          }
        : stock === "low"
          ? {
              product_variants: {
                some: {
                  deleted_at: null,
                  stock_quantity: {
                    gt: 0,
                    lte: LOW_STOCK_THRESHOLD,
                  },
                },
              },
            }
          : {};

  const where = {
    deleted_at: null,
    ...(query
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          },
        }
      : {}),
    ...(status ? { status } : {}),
    ...(category ? { category_id: category } : {}),
    ...stockWhere,
  };

  const [total, products] = await Promise.all([
    prisma.products.count({ where }),
    prisma.products.findMany({
      where,
      orderBy: [{ updated_at: "desc" }, { id: "desc" }],
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      include: {
        categories: true,
        product_images: {
          where: { variant_id: null },
          orderBy: [{ position: "asc" }, { id: "asc" }],
          take: 1,
        },
        product_variants: {
          where: { deleted_at: null },
          select: {
            id: true,
            stock_quantity: true,
            price_cents: true,
            status: true,
          },
        },
      },
    }),
  ]);

  return {
    products: products.map((product) => {
      const totalStock = product.product_variants.reduce(
        (sum, variant) => sum + variant.stock_quantity,
        0,
      );
      const minPrice = product.product_variants.reduce((min, variant) => {
        return variant.price_cents < min ? variant.price_cents : min;
      }, product.product_variants[0]?.price_cents || 0);

      return {
        id: Number(product.id),
        name: product.name,
        description: product.description,
        status: product.status,
        categoryName: product.categories?.name || "Uncategorized",
        categoryId: product.category_id ? Number(product.category_id) : null,
        imageUrl: product.product_images[0]?.url || "/icons/product-placeholder.svg",
        variantsCount: product.product_variants.length,
        totalStock,
        minPrice,
        updatedAt: product.updated_at,
      };
    }),
    filters: {
      query,
      status,
      category: category ? `${category}` : "",
      stock,
    },
    pagination: buildPagination({ total, page, pageSize: ADMIN_PAGE_SIZE }),
  };
}

export async function getAdminProductDetail(productId) {
  await ensureAdminAction();

  const normalizedProductId = normalizeOptionalBigInt(productId);

  if (normalizedProductId === null) {
    return null;
  }

  const product = await prisma.products.findFirst({
    where: { id: normalizedProductId, deleted_at: null },
    include: PRODUCT_BASE_INCLUDE,
  });

  return toSafeJson(product);
}

export async function getAdminVariantDetail(productId, variantId) {
  await ensureAdminAction();

  const normalizedProductId = normalizeOptionalBigInt(productId);
  const normalizedVariantId = normalizeOptionalBigInt(variantId);

  if (normalizedProductId === null || normalizedVariantId === null) {
    return null;
  }

  const variant = await prisma.product_variants.findFirst({
    where: {
      id: normalizedVariantId,
      product_id: normalizedProductId,
      deleted_at: null,
    },
    include: {
      products: {
        include: {
          categories: true,
        },
      },
      product_images: {
        orderBy: [{ position: "asc" }, { id: "asc" }],
      },
      variant_options: {
        orderBy: { id: "asc" },
      },
      variant_specs: {
        orderBy: { id: "asc" },
      },
    },
  });

  return toSafeJson(variant);
}

export async function createProductAction(formData) {
  await ensureAdminAction();

  const name = normalizeText(formData.get("name"));
  const description = normalizeText(formData.get("description"));
  const categoryId = normalizeOptionalNumber(formData.get("categoryId"));
  const status = normalizeText(formData.get("status")) || "draft";
  const specs = groupPairs(parseJsonArray(formData.get("specs")));
  const uploadedFiles = formData.getAll("newImages").filter((file) => file && file.size > 0);

  if (!name) {
    throw new Error("Product name is required.");
  }

  if (specs.length === 0) {
    throw new Error("Add at least one product specification.");
  }

  if (uploadedFiles.some((file) => file?.size > 5 * 1024 * 1024)) {
    throw new Error("Each product image must be 5MB or smaller.");
  }

  const product = await prisma.products.create({
    data: {
      name,
      description: description || null,
      category_id: categoryId,
      status,
      product_specs: {
        create: specs.map((spec) => ({ key: spec.key, value: spec.value })),
      },
    },
    include: PRODUCT_BASE_INCLUDE,
  });

  const imageUrls = await uploadImages(uploadedFiles, ["products", `${product.id}`]);

  if (imageUrls.length > 0) {
    await prisma.product_images.createMany({
      data: imageUrls.map((url, index) => ({
        product_id: product.id,
        url,
        position: index + 1,
      })),
    });
  }

  revalidateLocalizedPaths(["/admin", "/admin/products"]);
  return product;
}

export async function updateProductAction(formData) {
  await ensureAdminAction();

  const productId = Number(formData.get("productId"));
  const name = normalizeText(formData.get("name"));
  const description = normalizeText(formData.get("description"));
  const categoryId = normalizeOptionalNumber(formData.get("categoryId"));
  const status = normalizeText(formData.get("status")) || "draft";
  const specs = groupPairs(parseJsonArray(formData.get("specs")));
  const retainedImageIds = parseNumberArray(formData.get("retainedImageIds"));
  const uploadedFiles = formData.getAll("newImages").filter((file) => file && file.size > 0);

  if (!productId || !name) {
    throw new Error("Product information is incomplete.");
  }

  if (specs.length === 0) {
    throw new Error("Add at least one product specification.");
  }

  if (uploadedFiles.some((file) => file?.size > 5 * 1024 * 1024)) {
    throw new Error("Each product image must be 5MB or smaller.");
  }

  const currentImages = await prisma.product_images.findMany({
    where: { product_id: productId, variant_id: null },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });

  const imagesToDelete = currentImages.filter((image) => !retainedImageIds.includes(image.id));
  await Promise.all(imagesToDelete.map((image) => deleteLocalUpload(image.url)));

  await prisma.products.update({
    where: { id: productId },
    data: {
      name,
      description: description || null,
      category_id: categoryId,
      status,
    },
  });

  await prisma.product_specs.deleteMany({ where: { product_id: productId } });

  if (specs.length > 0) {
    await prisma.product_specs.createMany({
      data: specs.map((spec) => ({
        product_id: productId,
        key: spec.key,
        value: spec.value,
      })),
    });
  }

  await prisma.product_images.deleteMany({
    where: {
      product_id: productId,
      variant_id: null,
      id: { notIn: retainedImageIds.length ? retainedImageIds : [-1] },
    },
  });

  const newImageUrls = await uploadImages(uploadedFiles, ["products", `${productId}`]);

  const retainedImages = await prisma.product_images.findMany({
    where: { product_id: productId, variant_id: null },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });

  await Promise.all(
    retainedImages.map((image, index) =>
      prisma.product_images.update({
        where: { id: image.id },
        data: { position: index + 1 },
      }),
    ),
  );

  if (newImageUrls.length > 0) {
    await prisma.product_images.createMany({
      data: newImageUrls.map((url, index) => ({
        product_id: productId,
        url,
        position: retainedImages.length + index + 1,
      })),
    });
  }

  await prisma.$transaction(async (tx) => {
    await syncProductCardsByProductId({ tx, productId });
  });

  revalidateLocalizedPaths(["/admin", "/admin/products"]);
}

export async function softDeleteProductAction(formData) {
  await ensureAdminAction();

  const productId = Number(formData.get("productId"));

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  const deletedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.products.update({
      where: { id: productId },
      data: {
        deleted_at: deletedAt,
        status: "archived",
      },
    });

    await tx.product_variants.updateMany({
      where: { product_id: productId },
      data: {
        deleted_at: deletedAt,
        status: "archived",
      },
    });

    await tx.product_cards.updateMany({
      where: { product_id: productId },
      data: {
        deleted_at: deletedAt,
        is_active: false,
      },
    });
  });

  revalidateLocalizedPaths(["/admin", "/admin/products", "/catalog"]);
}

export async function createVariantAction(formData) {
  await ensureAdminAction();

  const productId = Number(formData.get("productId"));
  const variantName = normalizeText(formData.get("variantName"));
  const priceCents = normalizeOptionalNumber(formData.get("priceCents"));
  const stockQuantity = normalizeOptionalNumber(formData.get("stockQuantity")) || 0;
  const status = normalizeText(formData.get("status")) || "draft";
  const options = groupPairs(parseJsonArray(formData.get("options")));
  const specs = groupPairs(parseJsonArray(formData.get("specs")));
  const uploadedFiles = formData.getAll("newImages").filter((file) => file && file.size > 0);

  if (!productId || !variantName || priceCents === null) {
    throw new Error("Variant information is incomplete.");
  }

  if (options.length === 0) {
    throw new Error("Add at least one variant option.");
  }

  if (uploadedFiles.some((file) => file?.size > 5 * 1024 * 1024)) {
    throw new Error("Each variant image must be 5MB or smaller.");
  }

  const variant = await prisma.product_variants.create({
    data: {
      product_id: productId,
      variant_name: variantName,
      price_cents: priceCents,
      stock_quantity: stockQuantity,
      status,
      variant_options: {
        create: options.map((item) => ({ key: item.key, value: item.value })),
      },
      variant_specs: {
        create: specs.map((item) => ({ key: item.key, value: item.value })),
      },
    },
  });

  const imageUrls = await uploadImages(uploadedFiles, ["products", `${productId}`, "variants", `${variant.id}`]);

  if (imageUrls.length > 0) {
    await prisma.product_images.createMany({
      data: imageUrls.map((url, index) => ({
        product_id: productId,
        variant_id: variant.id,
        url,
        position: index + 1,
      })),
    });
  }

  await prisma.$transaction(async (tx) => {
    await syncProductCard({ tx, variantId: variant.id });
  });

  revalidateLocalizedPaths(["/admin", "/admin/products", `/admin/products/${productId}`]);
  return variant;
}

export async function updateVariantAction(formData) {
  await ensureAdminAction();

  const productId = Number(formData.get("productId"));
  const variantId = Number(formData.get("variantId"));
  const variantName = normalizeText(formData.get("variantName"));
  const priceCents = normalizeOptionalNumber(formData.get("priceCents"));
  const stockQuantity = normalizeOptionalNumber(formData.get("stockQuantity")) || 0;
  const status = normalizeText(formData.get("status")) || "draft";
  const options = groupPairs(parseJsonArray(formData.get("options")));
  const specs = groupPairs(parseJsonArray(formData.get("specs")));
  const retainedImageIds = parseNumberArray(formData.get("retainedImageIds"));
  const uploadedFiles = formData.getAll("newImages").filter((file) => file && file.size > 0);

  if (!productId || !variantId || !variantName || priceCents === null) {
    throw new Error("Variant information is incomplete.");
  }

  if (options.length === 0) {
    throw new Error("Add at least one variant option.");
  }

  if (uploadedFiles.some((file) => file?.size > 5 * 1024 * 1024)) {
    throw new Error("Each variant image must be 5MB or smaller.");
  }

  const currentImages = await prisma.product_images.findMany({
    where: { variant_id: variantId },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });

  const imagesToDelete = currentImages.filter((image) => !retainedImageIds.includes(image.id));
  await Promise.all(imagesToDelete.map((image) => deleteLocalUpload(image.url)));

  await prisma.product_variants.update({
    where: { id: variantId },
    data: {
      variant_name: variantName,
      price_cents: priceCents,
      stock_quantity: stockQuantity,
      status,
    },
  });

  await prisma.variant_options.deleteMany({ where: { variant_id: variantId } });
  await prisma.variant_specs.deleteMany({ where: { variant_id: variantId } });

  if (options.length > 0) {
    await prisma.variant_options.createMany({
      data: options.map((item) => ({
        variant_id: variantId,
        key: item.key,
        value: item.value,
      })),
    });
  }

  if (specs.length > 0) {
    await prisma.variant_specs.createMany({
      data: specs.map((item) => ({
        variant_id: variantId,
        key: item.key,
        value: item.value,
      })),
    });
  }

  await prisma.product_images.deleteMany({
    where: {
      variant_id: variantId,
      id: { notIn: retainedImageIds.length ? retainedImageIds : [-1] },
    },
  });

  const retainedImages = await prisma.product_images.findMany({
    where: { variant_id: variantId },
    orderBy: [{ position: "asc" }, { id: "asc" }],
  });

  await Promise.all(
    retainedImages.map((image, index) =>
      prisma.product_images.update({
        where: { id: image.id },
        data: { position: index + 1 },
      }),
    ),
  );

  const newImageUrls = await uploadImages(uploadedFiles, ["products", `${productId}`, "variants", `${variantId}`]);

  if (newImageUrls.length > 0) {
    await prisma.product_images.createMany({
      data: newImageUrls.map((url, index) => ({
        product_id: productId,
        variant_id: variantId,
        url,
        position: retainedImages.length + index + 1,
      })),
    });
  }

  await prisma.$transaction(async (tx) => {
    await syncProductCard({ tx, variantId });
  });

  revalidateLocalizedPaths([
    "/admin",
    "/admin/products",
    `/admin/products/${productId}`,
    `/admin/products/${productId}/variants/${variantId}`,
  ]);
}

export async function softDeleteVariantAction(formData) {
  await ensureAdminAction();

  const productId = Number(formData.get("productId"));
  const variantId = Number(formData.get("variantId"));

  if (!productId || !variantId) {
    throw new Error("Variant ID is required.");
  }

  const deletedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.product_variants.update({
      where: { id: variantId },
      data: {
        deleted_at: deletedAt,
        status: "archived",
      },
    });

    await tx.product_cards.updateMany({
      where: { variant_id: variantId },
      data: {
        deleted_at: deletedAt,
        is_active: false,
      },
    });
  });

  revalidateLocalizedPaths(["/admin", "/admin/products", `/admin/products/${productId}`]);
}
