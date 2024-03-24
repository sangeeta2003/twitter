import express from "express";

import { createTweet } from "../controllers/tweetControler.js";
import isAuthenticated from "../config/auth.js";
const router = express.Router();

router.route("/create").post(isAuthenticated, createTweet);
export default router;
