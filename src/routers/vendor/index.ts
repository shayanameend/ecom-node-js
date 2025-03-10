import { Router } from "express";

import { categoriesRouter } from "~/routers/vendor/categories";
import { ordersRouter } from "~/routers/vendor/orders";
import { productsRouter } from "~/routers/vendor/products";
import { profileRouter } from "~/routers/vendor/profile";
import { reviewsRouter } from "~/routers/vendor/reviews";
import { vendorsRouter } from "~/routers/vendor/vendors";

const vendorRouter = Router();

vendorRouter.use("/profile", profileRouter);
vendorRouter.use("/categories", categoriesRouter);
vendorRouter.use("/vendors", vendorsRouter);
vendorRouter.use("/products", productsRouter);
vendorRouter.use("/orders", ordersRouter);
vendorRouter.use("/reviews", reviewsRouter);

export { vendorRouter };
