import { Router } from "express";

import {
  getVendorProfile,
  updateVendorProfile,
} from "~/controllers/vendor/profile";
import { uploadOne } from "~/middlewares/upload";

const profileRouter = Router();

profileRouter.get("/", getVendorProfile);

profileRouter.put("/", uploadOne("picture"), updateVendorProfile);

export { profileRouter };
