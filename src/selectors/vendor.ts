import type { Prisma } from "@prisma/client";

const profile: Prisma.VendorSelect = {
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
};

const product: Prisma.ProductSelect = {
  id: true,
  pictureIds: true,
  name: true,
  description: true,
  sku: true,
  stock: true,
  price: true,
  salePrice: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
};

const order: Prisma.OrderSelect = {
  id: true,
  price: true,
  status: true,
  orderToProduct: {
    select: {
      id: true,
      price: true,
      quantity: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

const user: Prisma.UserSelect = {
  id: true,
  pictureId: true,
  name: true,
  postalCode: true,
  phone: true,
  city: true,
  deliveryAddress: true,
  createdAt: true,
  updatedAt: true,
};

export const vendorSelector = {
  profile,
  product,
  order,
  user,
};
