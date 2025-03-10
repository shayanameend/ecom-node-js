import { Router } from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
} from "~/controllers/category";
import { verifyRequest } from "~/middlewares/auth";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);

categoryRouter.post(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "VENDOR"],
    isVerified: true,
  }),
  createCategory,
);

categoryRouter.put(
  "/:id",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
    isVerified: true,
  }),
  updateCategory,
);

export { categoryRouter };
