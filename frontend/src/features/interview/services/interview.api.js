import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/**
 * @description Service to generate interview report based on user self description, resume and job description
 */
export async function generateInterviewReport({
  jobDescription,
  selfDescription,
  resumeFile,
}) {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const res = await api.post("/api/interview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * @description Service to get interview report by interviewId
 */
export async function getInterviewReportById(interviewId) {
  try {
    const res = await api.get(`/api/interview/report/${interviewId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * @description Service to get all interview reports of logged in user
 */
export async function getAllInterviewReports() {
  try {
    const res = await api.get("/api/interview/");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
