import { Router } from "express";

import {
  getAdminProfile,
  updateAdminProfile,
} from "~/controllers/admin/profile";
import { uploadOne } from "~/middlewares/upload";

const profileRouter = Router();

profileRouter.get("/", getAdminProfile);

profileRouter.put("/", uploadOne("picture"), updateAdminProfile);

export { profileRouter };
