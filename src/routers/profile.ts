import { Router } from "express";

import {
  createProfile,
  getProfile,
  updateProfile,
} from "~/controllers/profile";
import { verifyRequest } from "~/middlewares/auth";
import { uploadOne } from "~/middlewares/upload";

const profileRouter = Router();

profileRouter.get(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  getProfile,
);

profileRouter.post(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  uploadOne("picture"),
  createProfile,
);

profileRouter.put(
  "/",
  verifyRequest({
    allowedTypes: ["ACCESS"],
    isVerified: true,
  }),
  uploadOne("picture"),
  updateProfile,
);

export { profileRouter };
