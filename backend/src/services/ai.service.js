import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

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

  const output = interviewReportSchema.parse(
    JSON.parse(interaction.output_text),
  );
  console.log(output);

  return JSON.parse(interaction.output_text);
}

///////////////////////////////////////////////////////////////

// import { GoogleGenAI } from "@google/genai";
// import * as z from "zod";

// const workoutJsonSchema = {
//   type: "object",
//   properties: {
//     workout_name: {
//       type: "string",
//       description: "The name of the workout plan.",
//     },

//     exercises: {
//       type: "array",
//       items: {
//         type: "object",
//         properties: {
//           name: {
//             type: "string",
//             description: "Name of the exercise.",
//           },
//           sets: {
//             type: "integer",
//             description: "Number of sets.",
//           },
//           reps: {
//             type: "integer",
//             description: "Number of reps per set.",
//           },
//         },
//         required: ["name", "sets", "reps"],
//       },
//     },

//     instructions: {
//       type: "array",
//       items: {
//         type: "string",
//       },
//     },
//   },

//   required: ["workout_name", "exercises", "instructions"],
// };

// const workoutSchema = z.fromJSONSchema(workoutJsonSchema);

// const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   const prompt = `
// Please extract the workout plan from the following text.

// Harsh follows a workout routine called Beginner Push Day.

// He starts with 3 sets of 10 push-ups, then does 4 sets of 8 bench presses,
// and finishes with 3 sets of 12 shoulder presses.

// Before starting, he warms up for 10 minutes.
// After the workout, he spends 5 minutes stretching.
// `;

//   const interaction = await client.interactions.create({
//     model: "gemini-3.5-flash",
//     input: prompt,
//     response_format: {
//       type: "text",
//       mime_type: "application/json",
//       schema: workoutJsonSchema,
//     },
//   });

//   console.log(interaction.output_text);

//   const jsonFormat = JSON.parse(interaction.output_text);
//   console.log(jsonFormat);

//   const recipe = workoutSchema.parse(JSON.parse(interaction.output_text));
//   console.log(recipe);
// }
