import express from "express";

import isAuthenticated from "../middlewares/isAuthentications.js";
import { getAllAttendance, getMyAttendance, punchIn, punchOut } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/punch-in", punchIn);
router.post("/punch-out", punchOut);
router.get("/user-all", getMyAttendance);
router.get("/all", getAllAttendance);



export default router;
