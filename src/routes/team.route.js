import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
    createTeam,
    getMyTeam,
    joinTeam,
    leaveTeam,
    removeMember,
    deleteTeam
} from "../controllers/team.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createTeam);
router.get("/my-team", authMiddleware, getMyTeam);
router.post("/join", authMiddleware, joinTeam);
router.post("/leave", authMiddleware, leaveTeam);
router.delete("/remove/:memberId", authMiddleware, removeMember);
router.delete("/delete", authMiddleware, deleteTeam);

export default router;