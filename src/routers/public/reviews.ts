import { Router } from "express";

const reviewsRouter = Router();

reviewsRouter.get("/:productId");

export { reviewsRouter };
