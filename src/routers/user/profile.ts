import { Router } from "express";

import { getUserProfile, updateUserProfile } from "~/controllers/user/profile";
import { uploadOne } from "~/middlewares/upload";

const profileRouter = Router();

profileRouter.get("/", getUserProfile);

profileRouter.put("/", uploadOne("picture"), updateUserProfile);

export { profileRouter };
