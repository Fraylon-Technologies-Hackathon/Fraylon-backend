import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import {
    getAllRegistrations,
    getAllSubmissions,
    getParticipantById,
    exportParticipantsCSV
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require both auth + admin role
router.use(authMiddleware, adminMiddleware);

router.get("/registrations", getAllRegistrations);
router.get("/registrations/:participantId", getParticipantById);
router.get("/submissions", getAllSubmissions);
router.get("/export/participants", exportParticipantsCSV);

export default router;