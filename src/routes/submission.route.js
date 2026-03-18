import express from "express";
import {
    createSubmission,
    getAllSubmissions,
    getSubmissionById,
    updateSubmission,
    deleteSubmission
} from "../controllers/submission.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSubmission);
router.get("/", authMiddleware, getAllSubmissions);
router.get("/:id", authMiddleware, getSubmissionById);
router.put("/:id", authMiddleware, updateSubmission);
router.delete("/:id", authMiddleware, deleteSubmission);

export default router;