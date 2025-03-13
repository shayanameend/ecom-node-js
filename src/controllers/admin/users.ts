import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { adminSelector } from "~/selectors/admin";
import { publicSelector } from "~/selectors/public";
import {
  getUserParamsSchema,
  getUsersQuerySchema,
  updateUserBodySchema,
  updateUserParamsSchema,
} from "~/validators/admin/users";

async function getUsers(request: Request, response: Response) {
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
      deliveryAddress,
      status,
      isVerified,
      isDeleted,
    } = getUsersQuerySchema.parse(request.query);

    const where: Prisma.UserWhereInput = {};

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

    if (deliveryAddress) {
      where.deliveryAddress = {
        contains: deliveryAddress,
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

    const users = await prisma.user.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        ...(sort === "LATEST" && { createdAt: "desc" }),
        ...(sort === "OLDEST" && { createdAt: "asc" }),
      },
      select: {
        ...userSelector.profile,
        auth: {
          select: {
            ...adminSelector.auth,
          },
        },
      },
    });

    const total = await prisma.user.count({ where });
    const pages = Math.ceil(total / limit);

    return response.success(
      {
        data: { users },
        meta: { total, pages, limit, page },
      },
      {
        message: "Users fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function getUser(request: Request, response: Response) {
  try {
    const { id } = getUserParamsSchema.parse(request.params);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        ...userSelector.profile,
        auth: {
          select: {
            ...adminSelector.auth,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundResponse("User not found!");
    }

    return response.success(
      {
        data: { user },
      },
      {
        message: "User fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function updateUser(request: Request, response: Response) {
  try {
    const { id } = updateUserParamsSchema.parse(request.params);
    const validatedData = updateUserBodySchema.parse(request.body);

    const user = await prisma.user.update({
      where: { id },
      data: {
        auth: {
          update: validatedData,
        },
      },
      select: {
        ...userSelector.profile,
        auth: {
          select: {
            ...adminSelector.auth,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundResponse("User not found!");
    }

    return response.success(
      {
        data: { user },
      },
      {
        message: "User updated successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getUsers, getUser, updateUser };
