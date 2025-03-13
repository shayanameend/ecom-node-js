import type { Prisma } from "@prisma/client";

const auth: Prisma.AuthSelect = {
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

const category: Prisma.CategorySelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
};

const vendor: Prisma.VendorSelect = {
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

const review: Prisma.ReviewSelect = {
  id: true,
  rating: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
};

export const publicSelector = {
  auth,
  category,
  vendor,
  product,
  order,
  user,
  review,
};
