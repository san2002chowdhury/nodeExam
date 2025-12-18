import express from "express";
import dotenv from "dotenv/config"
import { dbConnect } from "./src/config/dbConnect.js";
import userRoute from "./src/routes/userRoute.js";
import taskRouter from "./src/routes/taskRoute.js";
import multerRoute from "./src/routes/multerRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;

dbConnect();

app.use(express.json());
app.use("/upload", express.static("upload"));

app.use("/user", userRoute);
app.use("/task", taskRouter)
app.use("/picture", multerRoute)

app.listen(PORT, () => {
    console.log(`<======Server Started At PORT:-${PORT}=====>`);
})