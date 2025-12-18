import express from "express";
import { upload } from "../controllers/multerController.js";
import { addPicture } from "../controllers/addPicture.js";


const multerRoute = express.Router();

multerRoute.post("/upload", upload.single("picture"), addPicture);

export default multerRoute;