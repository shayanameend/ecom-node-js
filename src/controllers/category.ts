import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  createCategoryBodySchema,
  getCategoriesQuerySchema,
  updateCategoryBodySchema,
  updateCategoryParamsSchema,
} from "~/validators/category";

async function getCategories(request: Request, response: Response) {
  try {
    const { name, status, isDeleted } = getCategoriesQuerySchema.parse(
      request.query,
    );

    const where: Prisma.CategoryWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (status !== undefined) {
      where.status = status;
    }

    if (isDeleted !== undefined) {
      where.isDeleted = isDeleted;
    }

    const categories = await prisma.category.findMany({
      where,
      select: {
        id: true,
        name: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.success(
      {
        data: { categories },
      },
      {
        message: "Categories fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function createCategory(request: Request, response: Response) {
  try {
    const validatedData = createCategoryBodySchema.parse(request.body);

    const role = request.user.role;

    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
      validatedData.status = "PENDING";
    }

    const category = await prisma.category.create({
      data: validatedData,
      select: {
        id: true,
        name: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.success(
      {
        data: { category },
      },
      {
        message: "Category created successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function updateCategory(request: Request, response: Response) {
  try {
    const { id } = updateCategoryParamsSchema.parse(request.params);
    const validatedData = updateCategoryBodySchema.parse(request.body);

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      throw new NotFoundResponse("Category not found!");
    }

    return response.success(
      {
        data: { category },
      },
      {
        message: "Category updated successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getCategories, createCategory, updateCategory };
