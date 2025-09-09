import { Router } from "express";
import auth from "../middleware/auth.js";
import { uploadImagecategorycontroller } from "../controllers/uploadImagecategory.controller.js";
import upload from "../middleware/multer.js";

const uploadRouter=Router()

uploadRouter.post("/upload",auth,upload.single("image"),uploadImagecategorycontroller)

export default uploadRouter