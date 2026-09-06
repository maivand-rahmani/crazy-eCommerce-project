"use server";

import prisma from "../../../../prisma/client";
import { toSafeJson } from "../../../../prisma/funcs";

import {
  buildPagination,
  groupPairs,
  isAllowedImageFile,
  normalizeOptionalBigInt,
  normalizeOptionalNumber,
  normalizeText,
  parsePage,
  safeJsonParse,
  getProductImageUrl,
} from "@/shared/lib";
import { DEFAULT_SETTINGS } from "@/features/admin-settings/model/defaults";

import { ensureAdminAction } from "@/features/admin-common";
import { deleteS3Image, uploadS3Image } from "@/shared/lib/files";
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
  const rawImageUrl =
    variant.product_images[0]?.url ||
    (await tx.product_images.findFirst({
      where: { product_id: product.id, variant_id: null },
      orderBy: [{ position: "asc" }, { id: "asc" }],
    }))?.url ||
    "";
  const imageUrl = getProductImageUrl(rawImageUrl);

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

  try {
    for (const file of files) {
      if (!isAllowedImageFile(file)) {
        throw new Error("Only JPG, PNG, and WebP images are supported.");
      }
      const key = await uploadS3Image(file, segments);
      uploaded.push(key);
    }
  } catch (error) {
    // Best-effort rollback of objects uploaded within this batch.
    await Promise.allSettled(uploaded.map((key) => deleteS3Image(key)));
    throw error;
  }

  return uploaded;
}

function parseJsonArray(value) {
  return safeJsonParse(value || "[]", []);
}

function parseBigIntArray(value) {
  return parseJsonArray(value)
    .map((entry) => {
      try {
        return BigInt(`${entry}`);
      } catch {
        return null;
      }
    })
    .filter((entry) => entry !== null);
}

function toRetainedSet(ids) {
  return new Set(ids.map((id) => id.toString()));
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
  let pageSize = DEFAULT_SETTINGS["admin.pageSize"];
  let lowStockThreshold = DEFAULT_SETTINGS["admin.lowStockThreshold"];
  try {
    const { getSettings } = await import("@/features/admin-settings/model/settings");
    const s = await getSettings();
    pageSize = Number(s["admin.pageSize"] ?? pageSize);
    lowStockThreshold = Number(s["admin.lowStockThreshold"] ?? lowStockThreshold);
  } catch {}
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
                    lte: lowStockThreshold,
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
      skip: (page - 1) * pageSize,
      take: pageSize,
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
        imageUrl: getProductImageUrl(product.product_images[0]?.url),
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
    pagination: buildPagination({ total, page, pageSize }),
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

  let product = null;
  const uploadedKeys = [];

  try {
    product = await prisma.products.create({
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

    const imageKeys = await uploadImages(uploadedFiles, [`${product.id}`]);
    uploadedKeys.push(...imageKeys);

    if (imageKeys.length > 0) {
      await prisma.product_images.createMany({
        data: imageKeys.map((key, index) => ({
          product_id: product.id,
          url: key,
          position: index + 1,
        })),
      });
    }

    revalidateLocalizedPaths(["/admin", "/admin/products"]);
    return product;
  } catch (error) {
    // Best-effort rollback of newly uploaded objects and the created parent.
    await Promise.allSettled(uploadedKeys.map((key) => deleteS3Image(key)));
    if (product) {
      await prisma.products.delete({ where: { id: product.id } }).catch(() => {});
    }
    throw error;
  }
}

export async function updateProductAction(formData) {
  await ensureAdminAction();

  const productId = Number(formData.get("productId"));
  const name = normalizeText(formData.get("name"));
  const description = normalizeText(formData.get("description"));
  const categoryId = normalizeOptionalNumber(formData.get("categoryId"));
  const status = normalizeText(formData.get("status")) || "draft";
  const specs = groupPairs(parseJsonArray(formData.get("specs")));
  const retainedImageIds = parseBigIntArray(formData.get("retainedImageIds"));
  const retainedSet = toRetainedSet(retainedImageIds);
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

  const imagesToDelete = currentImages.filter((image) => !retainedSet.has(image.id.toString()));

  // Upload new objects before any destructive DB change.
  const newImageKeys = await uploadImages(uploadedFiles, [`${productId}`]);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.products.update({
        where: { id: productId },
        data: {
          name,
          description: description || null,
          category_id: categoryId,
          status,
        },
      });

      await tx.product_specs.deleteMany({ where: { product_id: productId } });

      if (specs.length > 0) {
        await tx.product_specs.createMany({
          data: specs.map((spec) => ({
            product_id: productId,
            key: spec.key,
            value: spec.value,
          })),
        });
      }

      await tx.product_images.deleteMany({
        where: {
          product_id: productId,
          variant_id: null,
          id: { notIn: retainedImageIds.length ? retainedImageIds : [BigInt(-1)] },
        },
      });

      const retainedImages = await tx.product_images.findMany({
        where: { product_id: productId, variant_id: null },
        orderBy: [{ position: "asc" }, { id: "asc" }],
      });

      for (const [index, image] of retainedImages.entries()) {
        await tx.product_images.update({
          where: { id: image.id },
          data: { position: index + 1 },
        });
      }

      if (newImageKeys.length > 0) {
        await tx.product_images.createMany({
          data: newImageKeys.map((key, index) => ({
            product_id: productId,
            url: key,
            position: retainedImages.length + index + 1,
          })),
        });
      }

      await syncProductCardsByProductId({ tx, productId });
    });

    // DB committed — safe to remove replaced objects best-effort.
    await Promise.allSettled(imagesToDelete.map((image) => deleteS3Image(image.url)));
  } catch (error) {
    // Roll back newly uploaded objects best-effort.
    await Promise.allSettled(newImageKeys.map((key) => deleteS3Image(key)));
    throw error;
  }

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

  let variant = null;
  const uploadedKeys = [];

  try {
    variant = await prisma.product_variants.create({
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

    const imageKeys = await uploadImages(uploadedFiles, [
      `${productId}`,
      "variants",
      `${variant.id}`,
    ]);
    uploadedKeys.push(...imageKeys);

    await prisma.$transaction(async (tx) => {
      if (imageKeys.length > 0) {
        await tx.product_images.createMany({
          data: imageKeys.map((key, index) => ({
            product_id: productId,
            variant_id: variant.id,
            url: key,
            position: index + 1,
          })),
        });
      }

      await syncProductCard({ tx, variantId: variant.id });
    });

    revalidateLocalizedPaths(["/admin", "/admin/products", `/admin/products/${productId}`]);
    return variant;
  } catch (error) {
    // Best-effort rollback of newly uploaded objects and the created parent.
    await Promise.allSettled(uploadedKeys.map((key) => deleteS3Image(key)));
    if (variant) {
      await prisma.product_variants.delete({ where: { id: variant.id } }).catch(() => {});
    }
    throw error;
  }
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
  const retainedImageIds = parseBigIntArray(formData.get("retainedImageIds"));
  const retainedSet = toRetainedSet(retainedImageIds);
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

  const imagesToDelete = currentImages.filter((image) => !retainedSet.has(image.id.toString()));

  // Upload new objects before any destructive DB change.
  const newImageKeys = await uploadImages(uploadedFiles, [
    `${productId}`,
    "variants",
    `${variantId}`,
  ]);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product_variants.update({
        where: { id: variantId },
        data: {
          variant_name: variantName,
          price_cents: priceCents,
          stock_quantity: stockQuantity,
          status,
        },
      });

      await tx.variant_options.deleteMany({ where: { variant_id: variantId } });
      await tx.variant_specs.deleteMany({ where: { variant_id: variantId } });

      if (options.length > 0) {
        await tx.variant_options.createMany({
          data: options.map((item) => ({
            variant_id: variantId,
            key: item.key,
            value: item.value,
          })),
        });
      }

      if (specs.length > 0) {
        await tx.variant_specs.createMany({
          data: specs.map((item) => ({
            variant_id: variantId,
            key: item.key,
            value: item.value,
          })),
        });
      }

      await tx.product_images.deleteMany({
        where: {
          variant_id: variantId,
          id: { notIn: retainedImageIds.length ? retainedImageIds : [BigInt(-1)] },
        },
      });

      const retainedImages = await tx.product_images.findMany({
        where: { variant_id: variantId },
        orderBy: [{ position: "asc" }, { id: "asc" }],
      });

      for (const [index, image] of retainedImages.entries()) {
        await tx.product_images.update({
          where: { id: image.id },
          data: { position: index + 1 },
        });
      }

      if (newImageKeys.length > 0) {
        await tx.product_images.createMany({
          data: newImageKeys.map((key, index) => ({
            product_id: productId,
            variant_id: variantId,
            url: key,
            position: retainedImages.length + index + 1,
          })),
        });
      }

      await syncProductCard({ tx, variantId });
    });

    // DB committed — safe to remove replaced objects best-effort.
    await Promise.allSettled(imagesToDelete.map((image) => deleteS3Image(image.url)));
  } catch (error) {
    // Roll back newly uploaded objects best-effort.
    await Promise.allSettled(newImageKeys.map((key) => deleteS3Image(key)));
    throw error;
  }

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
