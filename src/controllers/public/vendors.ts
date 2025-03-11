import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { getVendorsQuerySchema } from "~/validators/public/vendors";

async function getVendors(request: Request, response: Response) {
  try {
    const { page, limit, sort, name, city, categoryId } =
      getVendorsQuerySchema.parse(request.query);

    const where: Prisma.VendorWhereInput = {
      auth: {
        status: "APPROVED",
        role: "VENDOR",
        isVerified: true,
        isDeleted: false,
      },
    };

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (categoryId) {
      where.products = {
        some: {
          categoryId,
        },
      };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        ...(sort === "RELEVANCE" && {
          products: {
            _count: "desc",
          },
        }),
        ...(sort === "LATEST" && { createdAt: "desc" }),
        ...(sort === "OLDEST" && { createdAt: "asc" }),
      },
      select: {
        id: true,
        pictureId: true,
        name: true,
        description: true,
        postalCode: true,
        phone: true,
        city: true,
        pickupAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await prisma.vendor.count({ where });
    const pages = Math.ceil(total / limit);

    return response.success(
      {
        data: { vendors },
        meta: { total, pages, limit, page },
      },
      {
        message: "Vendors fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getVendors };
