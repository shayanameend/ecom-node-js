import { Router } from "express";

import { getProduct, getProducts } from "~/controllers/public/products";

const productsRouter = Router();

productsRouter.get("/", getProducts);

productsRouter.get("/:id", getProduct);

export { productsRouter };
