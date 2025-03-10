import { Router } from "express";

import { categoriesRouter } from "~/routers/admin/categories";
import { ordersRouter } from "~/routers/admin/orders";
import { productsRouter } from "~/routers/admin/products";
import { profileRouter } from "~/routers/admin/profile";
import { reviewsRouter } from "~/routers/admin/reviews";
import { vendorsRouter } from "~/routers/admin/vendors";

const adminRouter = Router();

adminRouter.use("/profile", profileRouter);
adminRouter.use("/categories", categoriesRouter);
adminRouter.use("/vendors", vendorsRouter);
adminRouter.use("/products", productsRouter);
adminRouter.use("/orders", ordersRouter);
adminRouter.use("/reviews", reviewsRouter);

export { adminRouter };
