import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import companyRoute from "./routes/comapny.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import attendanceRoute from "./routes/attendance.route.js"
import taskRoute from "./routes/task.routes.js"
import leaveRoute from "./routes/leave.route.js"
import session from 'express-session';

dotenv.config({});

const app = express();

//moddleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [process.env.CLIENT_SERVER];

const corsOptions = {
   origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax'
  }
}));

const PORT = process.env.PORT;

// apis
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/attendance", attendanceRoute);
app.use("/api/v1/task", taskRoute);
app.use("/api/leave",leaveRoute)

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
