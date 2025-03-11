import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { BadResponse, NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  createOrderBodySchema,
  getOrderParamsSchema,
  getOrdersQuerySchema,
} from "~/validators/user/orders";

async function getOrders(request: Request, response: Response) {
  try {
    const {
      page,
      limit,
      sort,
      status,
      minPrice,
      maxPrice,
      categoryId,
      vendorId,
      productId,
    } = getOrdersQuerySchema.parse(request.query);

    const user = await prisma.user.findUnique({
      where: { authId: request.user.id },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundResponse("Order not found!");
    }

    const where: Prisma.OrderWhereInput = {
      userId: user.id,
    };

    if (status) {
      where.status = status;
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    if (minPrice !== undefined) {
      where.price = {
        gte: minPrice,
      };
    }

    if (maxPrice !== undefined) {
      where.price = {
        lte: maxPrice,
      };
    }

    if (categoryId) {
      where.orderToProduct = {
        some: {
          product: {
            categoryId,
          },
        },
      };
    }

    if (vendorId) {
      where.orderToProduct = {
        every: {
          product: {
            vendorId,
          },
        },
      };
    }

    if (productId) {
      where.orderToProduct = {
        some: {
          productId,
        },
      };
    }

    const orders = await prisma.order.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        ...(sort === "LATEST" && { createdAt: "desc" }),
        ...(sort === "OLDEST" && { createdAt: "asc" }),
      },
      select: {
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
        user: {
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
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.success(
      {
        data: { orders },
      },
      {
        message: "Orders fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function getOrder(request: Request, response: Response) {
  try {
    const { id } = getOrderParamsSchema.parse(request.params);

    const user = await prisma.user.findUnique({
      where: { authId: request.user.id },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundResponse("Order not found!");
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
        userId: user.id,
      },
      select: {
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
        user: {
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
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new NotFoundResponse("Order not found!");
    }

    return response.success(
      {
        data: { order },
      },
      {
        message: "Order fetched successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

async function createOrder(request: Request, response: Response) {
  try {
    const { products: productsForOrder } = createOrderBodySchema.parse(
      request.body,
    );

    const user = await prisma.user.findUnique({
      where: { authId: request.user.id },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new BadResponse("Failed to toggle order status!");
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productsForOrder.map((product) => product.productId),
        },
        isDeleted: false,
        category: {
          isDeleted: false,
        },
      },
      select: {
        id: true,
        pictureIds: true,
        name: true,
        description: true,
        sku: true,
        stock: true,
        price: true,
        salePrice: true,
        isDeleted: true,
        categoryId: true,
        vendorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (products.length !== productsForOrder.length) {
      throw new BadResponse("Failed to create order!");
    }

    for (const productForOrder of productsForOrder) {
      const product = products.find((p) => p.id === productForOrder.productId);

      if (product && product.stock < productForOrder.quantity) {
        throw new BadResponse("Failed to create order!");
      }
    }

    const vendorIds = new Set(products.map((product) => product.vendorId));

    if (vendorIds.size > 1) {
      throw new BadResponse("Failed to create order!");
    }

    const totalPrice = products.reduce((totalPrice, product) => {
      const productForOrder = productsForOrder.find(
        (productForOrder) => productForOrder.productId === product.id,
      );

      return totalPrice + (productForOrder?.quantity || 1) * product.price;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          price: totalPrice,
        },
        select: {
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
          user: {
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
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      await tx.orderToProduct.createMany({
        data: products.map((product) => {
          const productForOrder = productsForOrder.find(
            (productForOrder) => productForOrder.productId === product.id,
          );

          return {
            orderId: newOrder.id,
            productId: product.id,
            price: product.price,
            quantity: productForOrder?.quantity || 1,
          };
        }),
      });

      for (const productForOrder of productsForOrder) {
        await tx.product.update({
          where: { id: productForOrder.productId },
          data: { stock: { decrement: productForOrder.quantity } },
        });
      }

      return newOrder;
    });

    if (!order) {
      throw new BadResponse("Failed to create order!");
    }

    return response.success(
      {
        data: { order },
      },
      {
        message: "Order created successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getOrders, getOrder, createOrder };
