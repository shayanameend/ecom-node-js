import { Router } from "express";

import { categoriesRouter } from "~/routers/admin/categories";
import { ordersRouter } from "~/routers/admin/orders";
import { productsRouter } from "~/routers/admin/products";
import { profileRouter } from "~/routers/admin/profile";
import { usersRouter } from "~/routers/admin/users";
import { vendorsRouter } from "~/routers/admin/vendors";

const adminRouter = Router();

adminRouter.use("/profile", profileRouter);
adminRouter.use("/categories", categoriesRouter);
adminRouter.use("/vendors", vendorsRouter);
adminRouter.use("/products", productsRouter);
adminRouter.use("/orders", ordersRouter);
adminRouter.use("/users", usersRouter);

export { adminRouter };
