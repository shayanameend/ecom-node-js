import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { BadResponse, NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { addFile, removeFile } from "~/services/file";
import {
  createProductBodySchema,
  getProductParamsSchema,
  getProductsQuerySchema,
  updateProductBodySchema,
  updateProductParamsSchema,
} from "~/validators/product";

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

async function createProduct(request: Request, response: Response) {
  try {
    const validatedData = createProductBodySchema.parse(request.body);

    if (!request.files || request.files.length === 0) {
      throw new BadResponse("At least 1 picture is required!");
    }

    const pictureIds: string[] = [];

    for (const file of request.files as Express.Multer.File[]) {
      const pictureId = addFile({ file });

      pictureIds.push(pictureId);
    }

    const product = await prisma.product.create({
      data: { ...validatedData, pictureIds },
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

    return response.success(
      {
        data: { product },
      },
      {
        message: "Product created successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function updateProduct(request: Request, response: Response) {
  try {
    const { id } = updateProductParamsSchema.parse(request.params);
    const validatedData = updateProductBodySchema.parse(request.body);

    for (const pictureId of validatedData.pictureIds) {
      removeFile({ key: pictureId });
    }

    const pictureIds: string[] = [];

    for (const file of request.files as Express.Multer.File[]) {
      const pictureId = addFile({ file });

      pictureIds.push(pictureId);
    }

    const product = await prisma.product.update({
      where: { id },
      data: { ...validatedData, pictureIds },
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
        message: "Product updated successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getProducts, getProduct, createProduct, updateProduct };
