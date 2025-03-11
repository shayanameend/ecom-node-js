import { Router } from "express";

const adminsRouter = Router();

adminsRouter.get("/");

adminsRouter.get("/:id");

adminsRouter.put("/:id");

export { adminsRouter };
