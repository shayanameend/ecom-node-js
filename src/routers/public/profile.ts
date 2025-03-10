import { Router } from "express";

import {
  createAdminProfile,
  createUserProfile,
  createVendorProfile,
} from "~/controllers/public/public";
import { verifyRequest } from "~/middlewares/auth";
import { uploadOne } from "~/middlewares/upload";

const profileRouter = Router();

profileRouter.post(
  "/admin",
  verifyRequest({
    isVerified: true,
    allowedTypes: ["ACCESS"],
    allowedRoles: ["UNSPECIFIED"],
  }),
  uploadOne("picture"),
  createAdminProfile,
);
profileRouter.post(
  "/vendor",
  verifyRequest({
    isVerified: true,
    allowedTypes: ["ACCESS"],
    allowedRoles: ["UNSPECIFIED"],
  }),
  uploadOne("picture"),
  createVendorProfile,
);
profileRouter.post(
  "/user",
  verifyRequest({
    isVerified: true,
    allowedTypes: ["ACCESS"],
    allowedRoles: ["UNSPECIFIED"],
  }),
  uploadOne("picture"),
  createUserProfile,
);

export { profileRouter };
