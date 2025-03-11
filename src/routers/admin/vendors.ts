import { Router } from "express";

const vendorsRouter = Router();

vendorsRouter.get("/");

vendorsRouter.get("/:id");

vendorsRouter.put("/:id");

export { vendorsRouter };
