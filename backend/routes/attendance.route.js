import express from "express";

import isAuthenticated from "../middlewares/isAuthentications.js";
import { getAllAttendance, getMyAttendance, punchIn, punchOut, updateAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/punch-in", isAuthenticated, punchIn);
router.post("/punch-out", isAuthenticated, punchOut);
router.get("/user-all", isAuthenticated, getMyAttendance);
router.get("/all", isAuthenticated, getAllAttendance);
router.put("/update/:id", isAuthenticated, updateAttendance);



export default router;
