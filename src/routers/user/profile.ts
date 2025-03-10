import { Router } from "express";

import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
} from "~/controllers/user/profile";
import { uploadOne } from "~/middlewares/upload";

const profileRouter = Router();

profileRouter.get("/", getUserProfile);

profileRouter.post("/", uploadOne("picture"), createUserProfile);

profileRouter.put("/", uploadOne("picture"), updateUserProfile);

export { profileRouter };
