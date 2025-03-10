import type { NextFunction, Request, Response } from "express";

import cors from "cors";
import express from "express";
import morgan from "morgan";

import { verifyRequest } from "~/middlewares/auth";
import { expandResponse } from "~/middlewares/response";
import { adminRouter } from "~/routers/admin";
import { authRouter } from "~/routers/auth";
import { userRouter } from "~/routers/user";
import { vendorRouter } from "~/routers/vendor";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expandResponse);

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/vendor", vendorRouter);
app.use("/user", userRouter);

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
