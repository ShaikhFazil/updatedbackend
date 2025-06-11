import express from "express";
import isAuthenticated from "../middlewares/isAuthentications.js";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, createTask);
router.get("/", isAuthenticated, getTasks);
router.put("/:id", isAuthenticated, updateTask);
router.delete("/:id", isAuthenticated, deleteTask);

export default router;