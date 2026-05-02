import { Router } from "express";
import { requireClerkUser } from "../middleware/clerkAuth.middleware.js";
import { requireApprovedDriver } from "../middleware/driver.middleware.js";
import {
  driverDashboard,
  userDashboard,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/user", requireClerkUser, userDashboard);

router.get("/driver", requireClerkUser, requireApprovedDriver, driverDashboard);

export default router;