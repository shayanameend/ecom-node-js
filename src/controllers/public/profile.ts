import type { Request, Response } from "express";

import { BadResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { addFile } from "~/utils/file";
import {
  createAdminProfileBodySchema,
  createProfileBodySchema,
  createUserProfileBodySchema,
  createVendorProfileBodySchema,
} from "~/validators/public/profile";

async function createProfile(request: Request, response: Response) {
  try {
    const { role } = createProfileBodySchema.parse(request.body);

    if (request.user.role !== "UNSPECIFIED") {
      throw new BadResponse("Profile already exists!");
    }

    if (!request.file) {
      throw new BadResponse("Profile picture is required!");
    }

    const pictureId = addFile({
      file: request.file,
    });

    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN": {
        const { name, phone } = createAdminProfileBodySchema.parse(
          request.body,
        );

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
            role,
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
      }
      case "VENDOR": {
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
            role,
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
      }
      case "USER": {
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
            role,
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
      }
    }
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { createProfile };
