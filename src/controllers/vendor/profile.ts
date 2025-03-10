import type { Request, Response } from "express";

import { BadResponse, NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { addFile, removeFile } from "~/utils/file";
import {
  createVendorProfileBodySchema,
  updateVendorProfileBodySchema,
} from "~/validators/profile";

async function getVendorProfile(request: Request, response: Response) {
  try {
    const profile = await prisma.vendor.findUnique({
      where: {
        authId: request.user.id,
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

    if (!profile) {
      throw new NotFoundResponse("Profile not found!");
    }

    return response.success(
      {
        data: {
          profile,
        },
      },
      {
        message: "Profile fetched successfully!",
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

async function updateVendorProfile(request: Request, response: Response) {
  try {
    if (request.user.role === "UNSPECIFIED") {
      throw new BadResponse("Profile does not exist!");
    }

    if (request.body.pictureId && !request.file) {
      throw new BadResponse("Profile picture is required!");
    }

    if (request.file && !request.body.pictureId) {
      throw new BadResponse("Picture ID is required!");
    }

    let pictureId = request.body.pictureId;

    if (pictureId) {
      removeFile({
        key: pictureId,
      });
    }

    if (request.file) {
      pictureId = addFile({
        file: request.file,
      });
    }

    const { name, description, phone, postalCode, city, pickupAddress } =
      updateVendorProfileBodySchema.parse(request.body);

    const profile = await prisma.vendor.update({
      where: {
        authId: request.user.id,
      },
      data: {
        pictureId,
        name,
        description,
        phone,
        postalCode,
        city,
        pickupAddress,
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

    return response.success(
      {
        data: {
          profile,
        },
      },
      {
        message: "Profile updated successfully!",
      },
    );
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { getVendorProfile, createVendorProfile, updateVendorProfile };
