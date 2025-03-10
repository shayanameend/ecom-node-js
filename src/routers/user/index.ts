import { Router } from "express";

import { ordersRouter } from "~/routers/user/orders";
import { productsRouter } from "~/routers/user/products";
import { profileRouter } from "~/routers/user/profile";
import { reviewsRouter } from "~/routers/user/reviews";
import { vendorsRouter } from "~/routers/user/vendors";

const userRouter = Router();

userRouter.use("/profile", profileRouter);
userRouter.use("/vendors", vendorsRouter);
userRouter.use("/products", productsRouter);
userRouter.use("/orders", ordersRouter);
userRouter.use("/reviews", reviewsRouter);

export { userRouter };
