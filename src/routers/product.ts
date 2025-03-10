import { Router } from "express";

import {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "~/controllers/product";
import { verifyRequest } from "~/middlewares/auth";
import { uploadMultiple } from "~/middlewares/upload";

const productRouter = Router();

productRouter.get("/", getProducts);

productRouter.get("/:id", getProduct);

productRouter.post(
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

productRouter.put(
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

export { productRouter };
