import type { Prisma } from "@prisma/client";

const profile: Prisma.UserSelect = {
  id: true,
  pictureId: true,
  name: true,
  phone: true,
  postalCode: true,
  city: true,
  deliveryAddress: true,
  createdAt: true,
  updatedAt: true,
};

export const userSelector = {
  profile,
};
