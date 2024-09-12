/** @format */

import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { urlencoded } from "express";
import noteRoute from "./routes/note.routes.js";
import userRoute from "./routes/user.routes.js";
import connectDB from "./utils/database/db.js";

const app = express();
const port = process.env.PORT || 7000;
const mongo_Uri = process.env.MONGODB_URI;

// include middlewares

// This Middleware Responsible for The Request Form Frontend Which Origins Comes & This Origin Access to Our server Response or Not.
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOptions));

// this middleware responsible for receive the json data from frontend
app.use(express.json());

// this middleware receive the cookie after login the user
app.use(cookieParser());

// this middleware help to receive the from data
app.use(urlencoded({ extended: true }));

// connect database
connectDB(mongo_Uri);

// import routes

app.use("/api/v1/user", userRoute);
app.use("/api/v1/note", noteRoute);

app.listen(port, () => {
    console.log(`server is listing on port ${port}`);
});

// throw error to frontend

app.use((err, req, res, next) => {
    const code = err.code || 500;
    const message = err.message || "Internal Server Error";

    return res.status(code).json({
        success: false,
        code,
        message,
    });
});
