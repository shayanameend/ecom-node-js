import * as zod from "zod";

const getProductsQuerySchema = zod.object({
  page: zod.coerce
    .number({
      message: "Page must be a number!",
    })
    .int({
      message: "Page must be an integer!",
    })
    .min(1, {
      message: "Page must be a positive number!",
    })
    .default(1),
  limit: zod.coerce
    .number({
      message: "Limit must be a number!",
    })
    .int({
      message: "Limit must be an integer!",
    })
    .min(1, {
      message: "Limit must be a positive number!",
    })
    .default(10),
  sort: zod
    .enum(["POPULARITY", "LATEST", "OLDEST"], {
      message: "Sort must be one of 'POPULARITY', 'LATEST', 'OLDEST'!",
    })
    .optional(),
  name: zod
    .string({
      message: "Name must be a string!",
    })
    .min(1, {
      message: "Name must be at least 1 characters long!",
    })
    .optional(),
  minStock: zod.coerce
    .number({
      message: "Stock must be a number!",
    })
    .int({
      message: "Stock must be an integer!",
    })
    .min(0, {
      message: "Stock must be a non-negative number!",
    })
    .optional(),
  minPrice: zod.coerce
    .number({
      message: "Min Price must be a number!",
    })
    .min(1, {
      message: "Min Price must be a positive number!",
    })
    .optional(),
  maxPrice: zod.coerce
    .number({
      message: "Max Price must be a number!",
    })
    .min(1, {
      message: "Max Price must be a positive number!",
    })
    .optional(),
  isDeleted: zod
    .preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      zod.boolean(),
    )
    .optional(),
  categoryId: zod
    .string({
      message: "Category ID must be a string!",
    })
    .length(24, {
      message: "Category ID must be a 24-character string!",
    })
    .optional(),
  vendorId: zod
    .string({
      message: "Vendor ID must be a string!",
    })
    .length(24, {
      message: "Vendor ID must be a 24-character string!",
    })
    .optional(),
});

const getProductParamsSchema = zod.object({
  id: zod
    .string({
      message: "ID must be a string!",
    })
    .length(24, {
      message: "ID must be a 24-character string!",
    }),
});

const createProductBodySchema = zod.object({
  name: zod
    .string({
      message: "Name must be a string!",
    })
    .min(3, {
      message: "Name must be at least 3 characters long!",
    })
    .max(255, {
      message: "Name must be at most 255 characters long!",
    }),
  description: zod
    .string({
      message: "Description must be a string!",
    })
    .min(3, {
      message: "Description must be at least 3 characters long!",
    })
    .max(255, {
      message: "Description must be at most 255 characters long!",
    }),
  sku: zod
    .string({
      message: "SKU must be a string!",
    })
    .min(3, {
      message: "SKU must be at least 3 characters long!",
    })
    .max(255, {
      message: "SKU must be at most 255 characters long!",
    }),
  stock: zod.coerce
    .number({
      message: "Stock must be a number!",
    })
    .int({
      message: "Stock must be an integer!",
    })
    .min(0, {
      message: "Stock must be a non-negative number!",
    }),
  price: zod.coerce
    .number({
      message: "Price must be a number!",
    })
    .min(1, {
      message: "Price must be a positive number!",
    }),
  salePrice: zod.coerce
    .number({
      message: "Sale price must be a number!",
    })
    .min(1, {
      message: "Sale price must be a positive number!",
    })
    .optional(),
  categoryId: zod
    .string({
      message: "Category ID must be a string!",
    })
    .length(24, {
      message: "Category ID must be a 24-character string!",
    }),
  vendorId: zod
    .string({
      message: "Vendor ID must be a string!",
    })
    .length(24, {
      message: "Vendor ID must be a 24-character string!",
    }),
});

const updateProductParamsSchema = zod.object({
  id: zod
    .string({
      message: "ID must be a string!",
    })
    .length(24, {
      message: "ID must be a 24-character string!",
    }),
});

const updateProductBodySchema = zod.object({
  pictureIds: zod
    .array(
      zod
        .string({
          message: "Picture ID must be a string!",
        })
        .length(40, {
          message: "Picture ID must be a 40-character string!",
        }),
    )
    .default([]),
  name: zod
    .string({
      message: "Name must be a string!",
    })
    .min(3, {
      message: "Name must be at least 3 characters long!",
    })
    .max(255, {
      message: "Name must be at most 255 characters long!",
    })
    .optional(),
  description: zod
    .string({
      message: "Description must be a string!",
    })
    .min(3, {
      message: "Description must be at least 3 characters long!",
    })
    .max(255, {
      message: "Description must be at most 255 characters long!",
    })
    .optional(),
  sku: zod
    .string({
      message: "SKU must be a string!",
    })
    .min(3, {
      message: "SKU must be at least 3 characters long!",
    })
    .max(255, {
      message: "SKU must be at most 255 characters long!",
    })
    .optional(),
  stock: zod.coerce
    .number({
      message: "Stock must be a number!",
    })
    .int({
      message: "Stock must be an integer!",
    })
    .min(0, {
      message: "Stock must be a non-negative number!",
    })
    .optional(),
  price: zod.coerce
    .number({
      message: "Price must be a number!",
    })
    .min(1, {
      message: "Price must be a positive number!",
    })
    .optional(),
  salePrice: zod.coerce
    .number({
      message: "Sale price must be a number!",
    })
    .min(1, {
      message: "Sale price must be a positive number!",
    })
    .optional(),
  isDeleted: zod
    .preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      zod.boolean(),
    )
    .optional(),
  categoryId: zod
    .string({
      message: "Category ID must be a string!",
    })
    .length(24, {
      message: "Category ID must be a 24-character string!",
    })
    .optional(),
  vendorId: zod
    .string({
      message: "Vendor ID must be a string!",
    })
    .length(24, {
      message: "Vendor ID must be a 24-character string!",
    })
    .optional(),
});

export {
  getProductsQuerySchema,
  getProductParamsSchema,
  createProductBodySchema,
  updateProductParamsSchema,
  updateProductBodySchema,
};
