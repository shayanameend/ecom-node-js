import { Router } from "express";

import { getVendors } from "~/controllers/public/vendors";

const vendorsRouter = Router();

vendorsRouter.get("/", getVendors);

export { vendorsRouter };
