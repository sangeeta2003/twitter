import express from "express";
import { Register, Login, logout, bookmark, getMyProfile, getOtherUser } from "../controllers/userController.js";
import isAuthenticatedMiddleware from "../config/auth.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/bookmark/:id").put(isAuthenticatedMiddleware, bookmark);
router.route("/profile/:id").get(isAuthenticatedMiddleware, getMyProfile);
router.route("/otheruser/:id").get(isAuthenticatedMiddleware,getOtherUser)

export default router;
