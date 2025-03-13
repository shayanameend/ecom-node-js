import type { Prisma } from "@prisma/client";

const auth: Prisma.AuthSelect = {
  id: true,
  email: true,
  status: true,
  role: true,
  isVerified: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
};

const profile: Prisma.VendorSelect = {
  id: true,
  pictureId: true,
  name: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
};

const category: Prisma.CategorySelect = {
  id: true,
  name: true,
  status: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
};

export const adminSelector = {
  auth,
  profile,
  category,
};
