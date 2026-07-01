import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {
  generateInterviewReportController,
  getAllInterviewReportsController,
  getInterviewReportByIdController,
} from "../controllers/interview.controller.js";
import { upload } from "../middlewares/file.middleware.js";

const router = Router();

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description, resume pdf and job description
 * @access private
 */
router.post(
  "/",
  verifyUser,
  upload.single("resume"),
  generateInterviewReportController,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId
 * @access private
 */
router.get(
  "/report/:interviewId",
  verifyUser,
  getInterviewReportByIdController,
);

/**
 * @route GET /api/interview/
 * @description Get all interview reports of logged in user
 * @access private
 */
router.get("/", verifyUser, getAllInterviewReportsController);

export default router;
