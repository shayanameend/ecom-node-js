import { Router } from "express";

import {
  createAdminProfile,
  getAdminProfile,
  updateAdminProfile,
} from "~/controllers/profile";
import { uploadOne } from "~/middlewares/upload";

const profileRouter = Router();

profileRouter.get("/", getAdminProfile);

profileRouter.post("/", uploadOne("picture"), createAdminProfile);

profileRouter.put("/", uploadOne("picture"), updateAdminProfile);

export { profileRouter };
