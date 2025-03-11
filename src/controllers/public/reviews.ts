import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  getReviewsParamsSchema,
  getReviewsQuerySchema,
} from "~/validators/public/reviews";

async function getReviews(request: Request, response: Response) {
  try {
    const { productId } = getReviewsParamsSchema.parse(request.params);
    const { page, limit, sort } = getReviewsQuerySchema.parse(request.query);

    const where: Prisma.ReviewWhereInput = {
      order: {
        orderToProduct: {
          some: {
            product: {
              id: productId,
              isDeleted: false,
              category: {
                status: "APPROVED",
                isDeleted: false,
              },
              vendor: {
                auth: {
                  status: "APPROVED",
                  isVerified: true,
                  isDeleted: false,
                },
              },
            },
          },
        },
      },
    };

    const reviews = await prisma.review.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        ...(sort === "LATEST" && { createdAt: "desc" }),
        ...(sort === "OLDEST" && { createdAt: "asc" }),
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await prisma.review.count({ where });
    const pages = Math.ceil(total / limit);

    return response.success(
      {
        data: { reviews },
        meta: { total, pages, limit, page },
      },
      {
        message: "Reviews fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getReviews };
