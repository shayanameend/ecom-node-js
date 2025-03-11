import { Router } from "express";

import { createOrder, getOrder, getOrders } from "~/controllers/user/orders";

const ordersRouter = Router();

ordersRouter.get("/", getOrders);

ordersRouter.get("/:id", getOrder);

ordersRouter.post("/", createOrder);

export { ordersRouter };
