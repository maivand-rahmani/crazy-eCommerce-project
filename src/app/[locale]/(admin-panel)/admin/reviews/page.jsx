import React from "react";
import { ShieldAlert } from "lucide-react";

import {
  deleteReviewAction,
  getAdminReviews,
  ReviewRowActions,
  toggleReviewHiddenAction,
} from "@/features/admin-reviews";
import { Pagination, FilterSubmitButton } from "@/features/admin-common";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  SectionTitle,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared";
import { formatDateTime } from "@/shared/lib";
import { Link } from "@/shared/i18n";

export const metadata = {
  title: "Admin Reviews | Cyber",
  robots: "noindex, nofollow",
};

const truncate = (value, limit = 90) => {
  if (!value) return "-";
  return value.length > limit ? `${value.slice(0, limit)}…` : value;
};

export default async function AdminReviewsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const reviewsResult = await getAdminReviews(resolvedSearchParams);

  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <SectionTitle title="Reviews" />

      <form className="space-y-4">
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_0.7fr_auto] lg:items-end">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Search</span>
              <Input
                defaultValue={reviewsResult.filters.query}
                name="query"
                placeholder="Review text, customer, product"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Visibility</span>
              <Select defaultValue={reviewsResult.filters.status} name="status">
                <option value="">All reviews</option>
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </Select>
            </label>
            <FilterSubmitButton />
          </CardContent>
        </Card>
      </form>

      {reviewsResult.reviews.length === 0 ? (
        <EmptyState
          title="No reviews found"
          description="Adjust your filters or wait for new customer reviews to arrive."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Reviews ({reviewsResult.pagination.total})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-[var(--admin-gap)]">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Reports</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {reviewsResult.reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {review.productId ? (
                        <Link
                          href={`/admin/products/${review.productId}`}
                          className="text-primary hover:underline"
                        >
                          {review.productName}
                        </Link>
                      ) : (
                        review.productName
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text">{review.userName}</p>
                        <p className="text-sm text-unactive-text">{review.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.rating >= 4 ? "success" : review.rating <= 2 ? "danger" : "default"}>
                        {review.rating} / 5
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[280px]">
                      <p className="text-sm text-text">{truncate(review.comment)}</p>
                      {review.isHidden ? (
                        <Badge variant="warning" className="mt-1">
                          Hidden
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {review.reportsCount > 0 ? (
                        <div className="flex items-start gap-2">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                          <div>
                            <p className="font-medium text-text">{review.reportsCount}</p>
                            {review.latestReportReason ? (
                              <p className="max-w-[200px] text-xs text-unactive-text">
                                {truncate(review.latestReportReason, 60)}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <span className="text-unactive-text">0</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(review.createdAt)}</TableCell>
                    <TableCell>
                      <ReviewRowActions
                        review={review}
                        toggleAction={toggleReviewHiddenAction}
                        deleteAction={deleteReviewAction}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              pathname="/admin/reviews"
              searchParams={resolvedSearchParams}
              pagination={reviewsResult.pagination}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
