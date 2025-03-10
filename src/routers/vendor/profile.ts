import { Router } from "express";

import {
  createVendorProfile,
  getVendorProfile,
  updateVendorProfile,
} from "~/controllers/vendor/profile";
import { uploadOne } from "~/middlewares/upload";

const profileRouter = Router();

profileRouter.get("/", getVendorProfile);

profileRouter.post("/", uploadOne("picture"), createVendorProfile);

profileRouter.put("/", uploadOne("picture"), updateVendorProfile);

export { profileRouter };
