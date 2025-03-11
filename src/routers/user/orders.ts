import { Router } from "express";

const ordersRouter = Router();

ordersRouter.get("/");

ordersRouter.get("/:id");

ordersRouter.post("/");

ordersRouter.put("/:id");

export { ordersRouter };
