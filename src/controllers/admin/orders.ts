import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import { NotFoundResponse, handleErrors } from "~/lib/error";
import { prisma } from "~/lib/prisma";
import {
  getOrderParamsSchema,
  getOrdersQuerySchema,
  toggleOrderStatusBodySchema,
  toggleOrderStatusParamsSchema,
} from "~/validators/admin/orders";

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

    const where: Prisma.OrderWhereInput = {};

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

    const total = await prisma.order.count({ where });
    const pages = Math.ceil(total / limit);

    return response.success(
      {
        data: { orders },
        meta: { total, pages, limit, page },
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

    const order = await prisma.order.findUnique({
      where: {
        id,
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

async function toggleOrderStatus(request: Request, response: Response) {
  try {
    const { id } = toggleOrderStatusParamsSchema.parse(request.params);
    const { status } = toggleOrderStatusBodySchema.parse(request.body);

    const order = await prisma.order.update({
      where: {
        id,
        status: {
          notIn: ["PENDING", "REJECTED", "CANCELLED", "RETURNED"],
        },
      },
      data: {
        status,
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
        message: "Order status toggled successfully!",
      },
    );
  } catch (error) {
    handleErrors({ response, error });
  }
}

export { getOrders, getOrder, toggleOrderStatus };
