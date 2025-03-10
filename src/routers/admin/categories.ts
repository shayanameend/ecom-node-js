import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "~/controllers/admin/categories";

const categoriesRouter = Router();

categoriesRouter.get("/", getCategories);

categoriesRouter.post("/", createCategory);

categoriesRouter.put("/:id", updateCategory);

categoriesRouter.delete("/:id", deleteCategory);

export { categoriesRouter };
