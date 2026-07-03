# PrepWise AI - AI-Powered Interview Preparation Assistant

PrepWise AI is a full-stack, AI-powered interview preparation web application. It empowers candidates to upload their resumes, provide job descriptions, and receive highly detailed, custom interview reports. These reports feature job description match scores, customized technical and behavioral Q&A guidelines, identified skill gaps, and a tailored day to day preparation roadmap. Additionally, it allows users to download customized, ATS-friendly, professional resumes in PDF format tailored specifically to their desired job profiles.

- **Frontend Production URL**: [https://prepwise-frontend.netlify.app](https://prepwise-frontend.netlify.app)
- **Tech Stack**: React 19, Vite, Express (Node.js), MongoDB (Mongoose), Gemini AI, Puppeteer, Sass.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Project Directory Structure](#project-directory-structure)
- [Detailed Package Analysis](#detailed-package-analysis)
  - [Backend Dependencies](#backend-dependencies)
  - [Frontend Dependencies](#frontend-dependencies)
- [Setup & Installation Instructions](#setup--installation-instructions)
  - [Environment Variables](#environment-variables)
  - [Installation Steps](#installation-steps)
- [API Endpoints](#api-endpoints)

---

## Key Features

1. **Secure Authentication**: Signup, Login, and Logout supported by JSON Web Tokens (JWT) stored in secure, `HttpOnly`, cross-site cookies, complete with a password hashing system and token blacklisting mechanism.
2. **Resume Parser**: Direct extraction of text from uploaded PDF resume documents using backend buffer parsing.
3. **AI-Generated Interview Reports**: Leverages the Gemini API (`gemini-3.5-flash`) to generate structured JSON outputs outlining:
   - **Match Score**: Candidate profile score matching the target job description (0-100).
   - **Technical Q&A**: Tailored questions, the interviewer's intent, and ideal answers.
   - **Behavioral Q&A**: Target questions emphasizing candidate soft skills.
   - **Skill Gaps**: Lacking skills categorized by severity (`low`, `medium`, `high`).
   - **n-days Preparation Plan**: A daily roadmap showing target topics and study tasks.
4. **Tailored Resume PDF Generation**: Dynamically drafts an ATS-friendly HTML resume based on user strengths matched to the job description and compiles it to a downloadable A4 PDF document using Puppeteer.

---

## Architecture Overview

The system is split into two major components:

- **Backend (Express API)**: Connected to MongoDB to persist user credentials and generated interview reports. Uses the `@google/genai` SDK to interact with Gemini, `pdf-parse` for text extraction, and `puppeteer` for headless HTML-to-PDF compilation.
- **Frontend (React SPA)**: Built using React 19, utilizing modern Client-Side Routing via React Router v7. Styles are modularized using Sass (SCSS). Axios handles secure cross-site REST calls sending the HttpOnly session token.

---

## Project Directory Structure

```text
PrepWise-AI/
├── backend/
│   ├── src/
│   │   ├── config/          # DB config (database.js)
│   │   ├── controllers/     # Controller handlers (auth, interview)
│   │   ├── middlewares/     # Authentication & file uploading middlewares
│   │   ├── models/          # Mongoose Schemas (User, InterviewReport, BlacklistToken)
│   │   ├── routes/          # Express API route mapping
│   │   ├── services/        # Third-party integrations (Gemini AI, Puppeteer PDF)
│   │   └── app.js           # Express App configuration
│   ├── server.js            # Node server entry point
│   ├── package.json         # Backend dependencies
│   └── .env                 # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/        # Login/Registration components, context, and pages
│   │   │   └── interview/   # Dashboard, report view, PDF download pages
│   │   ├── style/           # Global styles and mixins
│   │   ├── App.jsx          # React app entry point
│   │   ├── app.routes.jsx   # Router definition
│   │   └── main.jsx         # DOM mounting
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   └── .env                 # Frontend environment variables
└── README.md                # Root documentation
```

---

## Detailed Package Analysis

Here is a breakdown of all the packages listed in `package.json` across both the frontend and backend, explaining why they are needed and how they are used.

### Backend Dependencies

Located in `backend/package.json`

| Dependency            | Version   | Why It is Needed                                                                                                    | How It is Used in the Codebase                                                                                                                                                                                                                                                                                                                      |
| :-------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`@google/genai`**   | `^2.10.0` | Official Google SDK for interacting with Gemini models.                                                             | Initialized in [ai.service.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/services/ai.service.js#L125) as `new GoogleGenAI({ apiKey })`. Used inside `generateInterviewReport` and `generateResumePdf` via `client.interactions.create` with `model: "gemini-3.5-flash"` to generate structural JSON results.                           |
| **`bcryptjs`**        | `^3.0.3`  | Hashes and verifies passwords securely using a slow hashing algorithm to resist brute-force attacks.                | Imported in [auth.controller.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/controllers/auth.controller.js#L2). Used during registration to hash password input (`bcrypt.hash(password, 10)`) and during login to compare credentials (`bcrypt.compare(password, user.password)`).                                                      |
| **`cookie-parser`**   | `^1.4.7`  | Parses the HTTP request `Cookie` header and populates `req.cookies`.                                                | Registered as application-level middleware in [app.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/app.js#L12). Used in authentication middleware to read JWT cookie credentials (`req.cookies.token`).                                                                                                                                  |
| **`cors`**            | `^2.8.6`  | Configures Cross-Origin Resource Sharing rules to allow browser network requests from the frontend client's domain. | Placed in [app.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/app.js#L13-L18). Configured dynamically using `process.env.FRONTEND_URL` and `credentials: true` to allow cookies to be transmitted securely.                                                                                                                             |
| **`dotenv`**          | `^17.4.2` | Loads configurations from a local `.env` file into Node's `process.env` object.                                     | Imported right at the top of [server.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/server.js#L1) (`import "dotenv/config"`) to bootstrap the app with environment configs.                                                                                                                                                                 |
| **`express`**         | `^5.2.1`  | The underlying web server framework for handling routes, request lifecycle, response methods, and middleware.       | Configured inside [app.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/app.js#L9). Serves API endpoints, maps custom routers, and starts listeners inside [server.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/server.js#L9).                                                                                                  |
| **`jsonwebtoken`**    | `^9.0.3`  | Generates (signs) and validates JSON Web Tokens (JWT) for secure, stateless user session verification.              | Used in [auth.controller.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/controllers/auth.controller.js#L46) to generate tokens upon login/signup and in [auth.middleware.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/middlewares/auth.middleware.js#L24) via `jwt.verify(token, secret)` to guard private API endpoints. |
| **`mongoose`**        | `^9.7.3`  | Object Data Modeling (ODM) library for MongoDB, providing schema validations, queries, and type safety.             | Handles the database connection in [database.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/config/database.js#L5) (`mongoose.connect`) and defines collections for `User`, `InterviewReport`, and blacklisted auth tokens under `src/models/`.                                                                                         |
| **`multer`**          | `^2.2.0`  | Middleware for handling `multipart/form-data` requests, primarily used for file uploading.                          | Configured with memory storage in [file.middleware.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/middlewares/file.middleware.js#L4). Used in [interview.routes.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/routes/interview.routes.js#L21) (`upload.single("resume")`) to capture the candidate's PDF file input.       |
| **`pdf-parse`**       | `^2.4.5`  | Extracts plaintext strings out of binary PDF documents.                                                             | Imported in [interview.controller.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/controllers/interview.controller.js#L1). When a resume file is uploaded, the parser instantiates `new PDFParse({ data: file.buffer })` and extracts text via `parser.getText()` to pass it to the Gemini context.                                      |
| **`puppeteer`**       | `^25.2.1` | Headless browser manager used to programmatically render HTML/CSS and output documents (like A4 PDF print files).   | Used in [ai.service.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/services/ai.service.js#L159-L193). Launches chromium, feeds the AI-generated HTML, and outputs it to a file buffer via `page.pdf()`.                                                                                                                                 |
| **`zod`**             | `^4.4.3`  | TypeScript-first schema validation library.                                                                         | Used in [ai.service.js](file:///c:/Projects/Full-stack/PrepWise-AI/backend/src/services/ai.service.js#L123) (`z.fromJSONSchema`) to validate and safely typecast structured JSON responses received from the Gemini AI endpoint.                                                                                                                    |
| **`nodemon`** _(Dev)_ | `^3.1.14` | Process supervisor that monitors file updates in development and automatically restarts the node app.               | Executed in the development script command in `package.json` (`"dev": "nodemon server.js"`).                                                                                                                                                                                                                                                        |

---

### Frontend Dependencies

Located in `frontend/package.json`

| Dependency           | Version    | Why It is Needed                                                                                                             | How It is Used in the Codebase                                                                                                                                                                                                                                                                                                                         |
| :------------------- | :--------- | :--------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`axios`**          | `^1.18.1`  | Promise-based HTTP client for making API requests, offering interceptors, structured response objects, and default settings. | Configured in [auth.api.js](file:///c:/Projects/Full-stack/PrepWise-AI/frontend/src/features/auth/services/auth.api.js#L3) and [interview.api.js](file:///c:/Projects/Full-stack/PrepWise-AI/frontend/src/features/interview/services/interview.api.js#L3) with `withCredentials: true` to authenticate requests automatically using the cookie token. |
| **`react`**          | `^19.2.7`  | The React core library, responsible for component lifecycles, states, context, and JSX compilation.                          | Used to build interactive views, state hooks (`useState`, `useEffect`), and Context providers (`AuthContext`, `InterviewContext`).                                                                                                                                                                                                                     |
| **`react-dom`**      | `^19.2.7`  | The DOM renderer for React, mounting and syncing components to the browser's view.                                           | Used in [main.jsx](file:///c:/Projects/Full-stack/PrepWise-AI/frontend/src/main.jsx) to mount the React tree (`createRoot(document.getElementById('root')).render(<App />)`).                                                                                                                                                                          |
| **`react-router`**   | `^7.18.0`  | Declarative routing library for React (React Router v7). Handles client-side navigation.                                     | Configured in [app.routes.jsx](file:///c:/Projects/Full-stack/PrepWise-AI/frontend/src/app.routes.jsx) using `createBrowserRouter` to map public routes like `/login` and `/register`, and protected routes wrapping `/` (Home) and `/interview/:interviewId`.                                                                                         |
| **`sass`**           | `^1.101.0` | Compiler for Sass (SCSS) styles allowing nesting, mixins, custom styling utilities, and structured variables.                | Styles are compiled directly inside components and global stylesheets (e.g., `style.scss`, `auth.form.scss`).                                                                                                                                                                                                                                          |
| **`oxlint`** _(Dev)_ | `^1.69.0`  | An extremely fast JS/TS linter compiled in Rust that flags potential syntax errors and bugs.                                 | Configured via `.oxlintrc.json` and executed during code validation (`npm run lint`).                                                                                                                                                                                                                                                                  |
| **`vite`** _(Dev)_   | `^8.1.0`   | Fast bundler and local development server supporting Hot Module Replacement (HMR).                                           | Compiles production assets and hosts the dev server (`npm run dev`). Configured in `vite.config.js`.                                                                                                                                                                                                                                                   |

---

## Setup & Installation Instructions

### Environment Variables

To run the application locally, you must specify configuration keys for the frontend and backend.

#### Backend Env Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/prepwise?retryWrites=true&w=majority
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

#### Frontend Env Configuration

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
```

---

### Installation Steps

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

#### 1. Clone the repository

```bash
git clone https://github.com/Harsh-Thakur-2006/prepwise-ai.git
cd prepwise-ai
```

#### 2. Run the Backend API

Open a terminal and navigate to the `backend/` directory:

```bash
cd backend
# Install backend dependencies
npm install

# Start the server in development mode (runs on port 3000 by default)
npm run dev
```

#### 3. Run the Frontend client

Open a separate terminal and navigate to the `frontend/` directory:

```bash
cd frontend
# Install frontend dependencies
npm install

# Start the frontend dev server (runs on port 5173 by default)
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to test the application locally.

---

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/register`: Create a new user account.
- `POST /api/auth/login`: Authenticate email and password; sets HttpOnly cookie session.
- `GET /api/auth/logout`: Clears the HttpOnly token cookie and blacklists the token.
- `GET /api/auth/get-me`: Fetch current logged-in user profile details (Private).

### Interview Report Routes (`/api/interview`)

- `POST /api/interview/`: Generate a structured AI Interview report using form-data (requires `jobDescription`, optional `selfDescription`, and `resume` file input) (Private).
- `GET /api/interview/`: Retrieve metadata for all past interview reports created by the user (Private).
- `GET /api/interview/report/:interviewId`: Fetch the full report details by its database ID (Private).
- `POST /api/interview/resume/pdf/:interviewReportId`: Tailor a custom resume based on this interview report inputs and compile it into a downloadable PDF binary (Private).
