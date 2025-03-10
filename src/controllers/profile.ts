import type { Request, Response } from "express";

import { BadResponse, NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import { addFile, removeFile } from "~/services/file";
import {
  createAdminProfileBodySchema,
  createProfileBodySchema,
  createUserProfileBodySchema,
  createVendorProfileBodySchema,
  updateAdminProfileBodySchema,
  updateUserProfileBodySchema,
  updateVendorProfileBodySchema,
} from "~/validators/profile";

async function getProfile(request: Request, response: Response) {
  try {
    const role = request.user.role;

    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN": {
        const profile = await prisma.admin.findUnique({
          where: {
            authId: request.user.id,
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
      }
      case "VENDOR": {
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
      }
      case "USER": {
        const profile = await prisma.user.findUnique({
          where: {
            authId: request.user.id,
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
      }
      case "UNSPECIFIED": {
        throw new BadResponse("Invalid Role!");
      }
    }
  } catch (error) {
    return handleErrors({ response, error });
  }
}

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

async function updateProfile(request: Request, response: Response) {
  try {
    const role = request.user.role;

    if (role === "UNSPECIFIED") {
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

    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN": {
        const { name, phone } = updateAdminProfileBodySchema.parse(
          request.body,
        );

        const profile = await prisma.admin.update({
          where: {
            authId: request.user.id,
          },
          data: {
            pictureId,
            name,
            phone,
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
      }
      case "VENDOR": {
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
      }
      case "USER": {
        const { name, phone, postalCode, city, deliveryAddress } =
          updateUserProfileBodySchema.parse(request.body);

        const profile = await prisma.user.update({
          where: {
            authId: request.user.id,
          },
          data: {
            pictureId,
            name,
            phone,
            postalCode,
            city,
            deliveryAddress,
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
      }
    }
  } catch (error) {
    return handleErrors({ response, error });
  }
}

export { getProfile, createProfile, updateProfile };
