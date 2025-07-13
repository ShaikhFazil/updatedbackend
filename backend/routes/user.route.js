import express from "express";
import {
  deleteUserByAdmin,
  getAllUsers,
  login,
  logout,
  register,
  updateProfile,
  updateUserByAdmin,
} from "../controllers/user.controllers.js";
import isAuthenticated from "../middlewares/isAuthentications.js";
import { singleUpload } from "../middlewares/multer.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router
  .route("/profile/update")
  .post(isAuthenticated, singleUpload, updateProfile);
router.route("/logout").get(logout);


router.get("/admin/users", isAuthenticated, isAdmin, getAllUsers);
router.put("/admin/users/:id", isAuthenticated, isAdmin, updateUserByAdmin);
router.delete("/admin/users/:id", isAuthenticated, isAdmin, deleteUserByAdmin);

export default router;
