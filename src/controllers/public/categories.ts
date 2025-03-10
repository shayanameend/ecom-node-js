import type { Request, Response } from "express";

import { handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";

async function getCategories(_request: Request, response: Response) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        status: "APPROVED",
        isDeleted: false,
      },
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

export { getCategories };
