import type { Request, Response } from "express";

import { handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { createCategoryBodySchema } from "~/validators/vendor/categories";

async function createCategory(request: Request, response: Response) {
  try {
    const validatedData = createCategoryBodySchema.parse(request.body);

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

export { createCategory };
