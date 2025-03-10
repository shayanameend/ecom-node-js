import type { NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import morgan from "morgan";

import { verifyRequest } from "~/middlewares/auth";
import { expandResponse } from "~/middlewares/response";
import { authRouter } from "~/routers/auth";
import { categoryRouter } from "~/routers/category";
import { profileRouter } from "~/routers/profile";
import { productRouter } from "~/routers/product";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expandResponse);

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);

app.get(
  "/test",
  verifyRequest({ allowedTypes: ["ACCESS"], isVerified: true }),
  (_request, response) => {
    response.success({}, { message: "Test route!" });
  },
);

app.all("*", (_request, response) => {
  response.notFound({}, { message: "Not Found!" });
});

app.use(
  (
    error: Error,
    _request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    console.error(error);

    response.internalServerError({}, { message: "Internal Server Error!" });
  },
);

export { app };
