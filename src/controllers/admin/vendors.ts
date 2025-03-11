import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  getVendorParamsSchema,
  getVendorsQuerySchema,
  updateVendorParamsSchema,
  updateVendorBodySchema,
} from "~/validators/admin/vendors";

async function getVendors(request: Request, response: Response) {
  try {
    const {
      page,
      limit,
      sort,
      email,
      name,
      phone,
      postalCode,
      city,
      pickupAddress,
      status,
      isVerified,
      isDeleted,
    } = getVendorsQuerySchema.parse(request.query);

    const where: Prisma.VendorWhereInput = {};

    if (email) {
      where.auth = {
        email: {
          contains: email,
          mode: "insensitive",
        },
      };
    }

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (phone) {
      where.phone = {
        contains: phone,
        mode: "insensitive",
      };
    }

    if (postalCode) {
      where.postalCode = {
        contains: postalCode,
        mode: "insensitive",
      };
    }

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    if (pickupAddress) {
      where.pickupAddress = {
        contains: pickupAddress,
        mode: "insensitive",
      };
    }

    if (status) {
      where.auth = {
        status,
      };
    }

    if (isVerified !== undefined) {
      where.auth = {
        isVerified,
      };
    }

    if (isDeleted !== undefined) {
      where.auth = {
        isDeleted,
      };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        ...(sort === "LATEST" && { createdAt: "desc" }),
        ...(sort === "OLDEST" && { createdAt: "asc" }),
      },
      select: {
        id: true,
        pictureId: true,
        name: true,
        phone: true,
        auth: {
          select: {
            id: true,
            email: true,
            status: true,
            role: true,
            isVerified: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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

async function getVendor(request: Request, response: Response) {
  try {
    const { id } = getVendorParamsSchema.parse(request.params);

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      select: {
        id: true,
        pictureId: true,
        name: true,
        phone: true,
        auth: {
          select: {
            id: true,
            email: true,
            status: true,
            role: true,
            isVerified: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!vendor) {
      throw new NotFoundResponse("Vendor not found!");
    }

    return response.success(
      {
        data: { vendor },
      },
      {
        message: "Vendor fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function updateVendor(request: Request, response: Response) {
  try {
    const { id } = updateVendorParamsSchema.parse(request.params);
    const validatedData = updateVendorBodySchema.parse(request.body);

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        auth: {
          update: validatedData,
        },
      },
      select: {
        id: true,
        pictureId: true,
        name: true,
        phone: true,
        auth: {
          select: {
            id: true,
            email: true,
            status: true,
            role: true,
            isVerified: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!vendor) {
      throw new NotFoundResponse("Vendor not found!");
    }

    return response.success(
      {
        data: { vendor },
      },
      {
        message: "Vendor updated successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getVendors, getVendor, updateVendor };
