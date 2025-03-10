import { Router } from "express";

import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "~/controllers/public/product";
import { verifyRequest } from "~/middlewares/auth";
import { uploadMultiple } from "~/middlewares/upload";

const productsRouter = Router();

productsRouter.get("/", getProducts);

productsRouter.get("/:id", getProduct);

productsRouter.post(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["VENDOR"],
    isVerified: true,
  }),
  uploadMultiple("pictures"),
  createProduct,
);

productsRouter.put(
  "/:id",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    allowedStatus: ["APPROVED"],
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "VENDOR"],
    isVerified: true,
  }),
  uploadMultiple("pictures"),
  updateProduct,
);

export { productsRouter };
