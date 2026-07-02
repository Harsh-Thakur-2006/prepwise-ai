import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import puppeteer from "puppeteer";

// from official gemini docs :- https://ai.google.dev/gemini-api/docs/get-started
const interviewReportJsonSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "The title of the job for which the interview report is generated",
    },
    matchScore: {
      type: "integer",
      description:
        "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The technical question that can be asked in the interview",
          },
          intention: {
            type: "string",
            description:
              "The intention of interviewer behind asking this question",
          },
          answer: {
            type: "string",
            description:
              "How to answer this question, what points to cover, what approach to take etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behaviouralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description:
              "The behavioural question that can be asked in the interview",
          },
          intention: {
            type: "string",
            description:
              "The intention of interviewer behind asking this question",
          },
          answer: {
            type: "string",
            description:
              "How to answer this question, what points to cover, what approach to take etc.",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The skill which the candidate is lacking",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description:
              "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
            description:
              "The day number in the preparation plan, starting from 1",
          },
          focus: {
            type: "string",
            description:
              "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
          },
          tasks: {
            type: "array",
            items: {
              type: "string",
              description:
                "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
            },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "technicalQuestions",
    "behaviouralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema);

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate an interview report for a candidate with the following details:
Resume: ${resume || "No resume provided"}
Self Description: ${selfDescription}
Job Description: ${jobDescription}`;

  const interaction = await client.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: interviewReportJsonSchema,
    },
  });

  console.log(interaction.output_text);

  const jsonFormat = JSON.parse(interaction.output_text);
  console.log(jsonFormat);

  const output = interviewReportSchema.parse(jsonFormat);
  console.log(output);

  return jsonFormat;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  console.log(await puppeteer.executablePath());
  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle2",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

const resumePdfJsonSchema = {
  type: "object",
  properties: {
    html: {
      type: "string",
      description:
        "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
    },
  },
  required: ["html"],
};

const resumePdfSchema = z.fromJSONSchema(resumePdfJsonSchema);
export async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
    Generate a resume for a candidate with the following details:
    Resume: ${resume || "No resume provided"}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    The response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
    The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
    The content of resume should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
    You can highlight the content using some colors or different font styles but the overall design should be simple and professional.
    The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
    The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.   
  `;

  const response = await client.interactions.create({
    model: "gemini-3.5-flash",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: resumePdfJsonSchema,
    },
  });

  console.log(response.output_text);

  const jsonContent = JSON.parse(response.output_text);
  console.log(jsonContent);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  console.log(pdfBuffer);

  return pdfBuffer;
}
