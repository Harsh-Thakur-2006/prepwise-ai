import { PDFParse } from "pdf-parse";
import { generateInterviewReport } from "../services/ai.service.js";
import { InterviewReport } from "../models/interviewReport.model.js";

/**
 * @name generateInterviewReportController
 * @description Controller to generate new interview report based on user self description, resume and job description
 * @access private
 */
export async function generateInterviewReportController(req, res) {
  const { selfDescription, jobDescription } = req.body;
  const resumeFile = req.file;

  let resumeFileContent = "";

  if (req.file) {
    const parser = new PDFParse({
      data: req.file.buffer,
    });

    resumeFileContent = (await parser.getText()).text;
  }

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeFileContent,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await InterviewReport.create({
    user: req.user.id,
    resume: resumeFileContent,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  return res.status(201).json({
    success: true,
    message: "Interview report generated successfully",
    interviewReport,
  });
}

/**
 * @name getInterviewReportByIdController
 * @description Controller to get interview report by interviewId
 * @access private
 */
export async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await InterviewReport.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interview report fetched successfully",
      interviewReport,
    });
  } catch (error) {
    console.log("Error in finding interview report", error);
    return res.status(500).json({
      success: false,
      message: "Error while finding interview report",
    });
  }
}

/**
 * @name getAllInterviewReportsController
 * @description Controller to get all interview reports of logged in user
 * @access private
 */
export async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await InterviewReport.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan",
      );

    return res.status(200).json({
      success: true,
      message: "Interview reports fetched successfully",
      interviewReports,
    });
  } catch (error) {
    console.log("Error in getting interview reports", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting interview reports",
    });
  }
}
