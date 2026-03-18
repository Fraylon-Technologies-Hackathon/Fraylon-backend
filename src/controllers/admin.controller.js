import Participant from "../models/participant.model.js";
import Submission from "../models/submission.model.js";
import { Parser } from "json2csv";


// GET ALL REGISTRATIONS (with pagination)
export const getAllRegistrations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const participants = await Participant.find()
            .select("-password")
            .populate("teamId", "name")
            .skip(skip)
            .limit(limit);

        const total = await Participant.countDocuments();

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            participants
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET SINGLE PARTICIPANT DETAILS
export const getParticipantById = async (req, res) => {
    try {
        const { participantId } = req.params;

        const participant = await Participant.findById(participantId)
            .select("-password")
            .populate("teamId", "name description");

        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }

        res.json({ participant });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL SUBMISSIONS (with pagination)
export const getAllSubmissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const submissions = await Submission.find()
            .populate("teamId", "name members")
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Submission.countDocuments();

        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            submissions
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// EXPORT PARTICIPANTS TO CSV

export const exportParticipantsCSV = async (req, res) => {
    try {
        const participants = await Participant.find()
            .select("-password")
            .populate("teamId", "name");

        const data = participants.map((p) => ({
            Name: p.name,
            Email: p.email,
            Phone: p.phone || "N/A",
            College: p.college || "N/A",
            Role: p.role,
            Team: p.teamId ? p.teamId.name : "No Team",
            RegisteredAt: p.createdAt
                ? new Date(p.createdAt).toLocaleString()
                : "N/A"
        }));

        const parser = new Parser({
            fields: ["Name", "Email", "Phone", "College", "Role", "Team", "RegisteredAt"]
        });

        const csv = parser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("participants.csv");
        res.send(csv);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};