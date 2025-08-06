import express from "express";
import { getAllFeedback, getFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/", getFeedback);

router.get("/admin/feedback-list", getAllFeedback)