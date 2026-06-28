import { Router } from "express";
import {
  getMeController,
  loginUserController,
  logoutUserController,
  registerController,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", registerController);

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access Public
 */
router.post("/login", loginUserController);

/**
 * @route GET /api/auth/logout
 * @description Logout user by clearing token from user cookie and adding it to blacklist
 * @access Public
 */
router.get("/logout", logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description Get the current logged in user details
 * @access Private
 */
router.get("/get-me", verifyUser, getMeController);

export default router;
