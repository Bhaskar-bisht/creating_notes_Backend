/** @format */

import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/userController/user.Controller.js";
import { userAuthentication } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(userAuthentication, logoutUser);

export default router;
