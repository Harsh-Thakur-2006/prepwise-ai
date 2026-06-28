import express from "express";
import cookieParser from "cookie-parser";

// import all the routes
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Health check working",
  });
});

// using all the routes
app.use("/api/auth", authRouter);

export default app;
