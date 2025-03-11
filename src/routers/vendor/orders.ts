import { Router } from "express";

const ordersRouter = Router();

ordersRouter.get("/");

ordersRouter.get("/:id");

ordersRouter.put("/:id");

export { ordersRouter };
