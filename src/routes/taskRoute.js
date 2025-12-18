import express from "express";
import { createTask, deleteTask, getAllTask, updateTask } from "../controllers/taskController.js";
import { hasToken } from "../middlewares/hasToken.js";
import { taskValidateSchema, validateTask } from "../validators/taskValidate.js";

const taskRouter = express.Router();

taskRouter.post("/create", hasToken, validateTask(taskValidateSchema), createTask);
taskRouter.get("/getAll", hasToken, getAllTask);
taskRouter.put("/update/:id", hasToken, updateTask);
taskRouter.delete("/delete/:id", hasToken, deleteTask);

export default taskRouter;