import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { sendMessage } from "~/utils/mail";
import {
  getProductParamsSchema,
  getProductsQuerySchema,
  toggleProductIsDeletedBodySchema,
  toggleProductIsDeletedParamsSchema,
} from "~/validators/admin/products";

async function getProducts(request: Request, response: Response) {
  try {
    const {
      page,
      limit,
      sort,
      name,
      minStock,
      minPrice,
      maxPrice,
      isDeleted,
      categoryId,
      vendorId,
    } = getProductsQuerySchema.parse(request.query);

    const where: Prisma.ProductWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (minStock !== undefined) {
      where.stock = {
        gte: minStock,
      };
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    if (minPrice !== undefined) {
      where.price = {
        gte: minPrice,
      };
    }

    if (maxPrice !== undefined) {
      where.price = {
        lte: maxPrice,
      };
    }

    if (isDeleted !== undefined) {
      where.isDeleted = isDeleted;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        ...(sort === "POPULARITY" && {
          orderToProduct: { _count: "desc" },
        }),
        ...(sort === "LATEST" && { createdAt: "desc" }),
        ...(sort === "OLDEST" && { createdAt: "asc" }),
      },
      select: {
        id: true,
        pictureIds: true,
        name: true,
        description: true,
        sku: true,
        stock: true,
        price: true,
        salePrice: true,
        isDeleted: true,
        categoryId: true,
        vendorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await prisma.product.count({ where });
    const pages = Math.ceil(total / limit);

    return response.success(
      {
        data: { products },
        meta: { total, pages, limit, page },
      },
      {
        message: "Products fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function getProduct(request: Request, response: Response) {
  try {
    const { id } = getProductParamsSchema.parse(request.params);

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        pictureIds: true,
        name: true,
        description: true,
        sku: true,
        stock: true,
        price: true,
        salePrice: true,
        isDeleted: true,
        categoryId: true,
        vendorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      throw new NotFoundResponse("Product not found!");
    }

    return response.success(
      {
        data: { product },
      },
      {
        message: "Product fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function toggleProductIsDeleted(request: Request, response: Response) {
  try {
    const { id } = toggleProductIsDeletedParamsSchema.parse(request.params);
    const validatedData = toggleProductIsDeletedBodySchema.parse(request.body);

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        pictureIds: true,
        name: true,
        description: true,
        sku: true,
        stock: true,
        price: true,
        salePrice: true,
        isDeleted: true,
        categoryId: true,
        vendorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!product) {
      throw new NotFoundResponse("Product not found!");
    }

    const email = (
      await prisma.product.findUnique({
        where: { id },
        select: {
          vendor: {
            select: {
              auth: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      })
    )?.vendor.auth.email;

    if (email) {
      sendMessage({
        to: email,
        subject: `Product ${validatedData.isDeleted ? "Deleted" : "Restored"}`,
        text: `Product ${product.name} with id ${product.id} has been ${
          validatedData.isDeleted ? "deleted" : "restored"
        }`,
      });
    }

    return response.success(
      {
        data: { product },
      },
      {
        message: "Product updated successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getProducts, getProduct, toggleProductIsDeleted };
