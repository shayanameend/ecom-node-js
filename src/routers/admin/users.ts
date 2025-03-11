import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/");

usersRouter.get("/:id");

usersRouter.put("/:id");

export { usersRouter };
