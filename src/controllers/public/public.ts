import type { Request, Response } from "express";

import { BadResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { addFile } from "~/utils/file";
import { createAdminProfileBodySchema } from "~/validators/admin/profile";
import { createUserProfileBodySchema } from "~/validators/user/profile";
import { createVendorProfileBodySchema } from "~/validators/vendor/profile";

async function createAdminProfile(request: Request, response: Response) {
  try {
    if (request.user.role !== "UNSPECIFIED") {
      throw new BadResponse("Profile already exists!");
    }

    if (!request.file) {
      throw new BadResponse("Profile picture is required!");
    }

    const pictureId = addFile({
      file: request.file,
    });

    const { name, phone } = createAdminProfileBodySchema.parse(request.body);

    const profile = await prisma.admin.create({
      data: {
        pictureId,
        name,
        phone,
        auth: {
          connect: {
            id: request.user.id,
          },
        },
      },
      select: {
        id: true,
        pictureId: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await prisma.auth.update({
      where: {
        id: request.user.id,
      },
      data: {
        role: "ADMIN",
      },
    });

    return response.success(
      {
        data: {
          profile,
        },
      },
      {
        message: "Profile created successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function createVendorProfile(request: Request, response: Response) {
  try {
    if (request.user.role !== "UNSPECIFIED") {
      throw new BadResponse("Profile already exists!");
    }

    if (!request.file) {
      throw new BadResponse("Profile picture is required!");
    }

    const pictureId = addFile({
      file: request.file,
    });

    const { name, description, phone, postalCode, city, pickupAddress } =
      createVendorProfileBodySchema.parse(request.body);

    const profile = await prisma.vendor.create({
      data: {
        pictureId,
        name,
        description,
        phone,
        postalCode,
        city,
        pickupAddress,
        auth: {
          connect: {
            id: request.user.id,
          },
        },
      },
      select: {
        id: true,
        pictureId: true,
        name: true,
        description: true,
        phone: true,
        postalCode: true,
        city: true,
        pickupAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await prisma.auth.update({
      where: {
        id: request.user.id,
      },
      data: {
        role: "VENDOR",
      },
    });

    return response.success(
      {
        data: {
          profile,
        },
      },
      {
        message: "Profile created successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

async function createUserProfile(request: Request, response: Response) {
  try {
    if (request.user.role !== "UNSPECIFIED") {
      throw new BadResponse("Profile already exists!");
    }

    if (!request.file) {
      throw new BadResponse("Profile picture is required!");
    }

    const pictureId = addFile({
      file: request.file,
    });

    const { name, phone, postalCode, city, deliveryAddress } =
      createUserProfileBodySchema.parse(request.body);

    const profile = await prisma.user.create({
      data: {
        pictureId,
        name,
        phone,
        postalCode,
        city,
        deliveryAddress,
        auth: {
          connect: {
            id: request.user.id,
          },
        },
      },
      select: {
        id: true,
        pictureId: true,
        name: true,
        phone: true,
        postalCode: true,
        city: true,
        deliveryAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await prisma.auth.update({
      where: {
        id: request.user.id,
      },
      data: {
        status: "APPROVED",
        role: "USER",
      },
    });

    return response.success(
      {
        data: {
          profile,
        },
      },
      {
        message: "Profile created successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { createAdminProfile, createVendorProfile, createUserProfile };
