import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    let res = null;
    try {
      setLoading(true);
      res = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      if (res?.interviewReport) {
        setReport(res.interviewReport);
      }

      return res?.interviewReport;
    } catch (error) {
      console.log("Error while generating interview report", error);
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    let res = null;
    try {
      setLoading(true);
      res = await getInterviewReportById(interviewId);
      if (res?.interviewReport) {
        setReport(res.interviewReport);
      }
      return res?.interviewReport;
    } catch (error) {
      console.log("Error while getting interview report", error);
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    let res = null;
    try {
      setLoading(true);
      res = await getAllInterviewReports();
      if (res?.interviewReports) {
        setReports(res.interviewReports);
      }

      return res?.interviewReports;
    } catch (error) {
      console.log("Error while getting interview report", error);
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewReportId) => {
    let res = null;
    try {
      setLoading(true);
      res = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(
        new Blob([res], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();

      return res?.interviewReports;
    } catch (error) {
      console.log("Error while getting resume pdf", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  };
};
