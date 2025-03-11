import { Router } from "express";

import { categoriesRouter } from "~/routers/vendor/categories";
import { ordersRouter } from "~/routers/vendor/orders";
import { productsRouter } from "~/routers/vendor/products";
import { profileRouter } from "~/routers/vendor/profile";
import { usersRouter } from "~/routers/vendor/users";

const vendorRouter = Router();

vendorRouter.use("/profile", profileRouter);
vendorRouter.use("/categories", categoriesRouter);
vendorRouter.use("/users", usersRouter);
vendorRouter.use("/products", productsRouter);
vendorRouter.use("/orders", ordersRouter);

export { vendorRouter };
