import { Router } from "express";

import { getOrder, getOrders } from "~/controllers/user/orders";

const ordersRouter = Router();

ordersRouter.get("/", getOrders);

ordersRouter.get("/:id", getOrder);

ordersRouter.post("/");

export { ordersRouter };
