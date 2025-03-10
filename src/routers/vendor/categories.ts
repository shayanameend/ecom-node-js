import { Router } from "express";

import { createCategory } from "~/controllers/vendor/categories";

const categoriesRouter = Router();

categoriesRouter.get("/", createCategory);

export { categoriesRouter };
