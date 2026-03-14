import Team from "../models/team.model.js";
import Participant from "../models/participant.model.js";
import crypto from "crypto";


// HELPER: generate a unique invite code
const generateUniqueInviteCode = async () => {
    let inviteCode, existing;
    do {
        inviteCode = crypto.randomBytes(4).toString("hex"); // 8 hex chars, more entropy
        existing = await Team.findOne({ inviteCode });
    } while (existing);
    return inviteCode;
};

// CREATE TEAM

export const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;

        const user = await Participant.findById(req.user.id);

        if (user.teamId) {
            return res.status(400).json({
                message: "You are already in a team"
            });
        }

        const inviteCode = await generateUniqueInviteCode();

        const team = await Team.create({
            name,
            description,
            leader: req.user.id,
            members: [req.user.id],
            inviteCode
        });

        user.teamId = team._id;
        await user.save();

        // Populate members and leader before returning
        const populatedTeam = await team.populate("members leader", "name email");

        res.status(201).json({
            message: "Team created successfully",
            team: populatedTeam
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET MY TEAM
export const getMyTeam = async (req, res) => {
    try {
        const user = await Participant.findById(req.user.id);

        if (!user.teamId) {
            return res.status(404).json({
                message: "You are not in a team"
            });
        }

        const team = await Team.findById(user.teamId).populate(
            "members leader",
            "name email"
        );

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.json({ team });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// JOIN TEAM

export const joinTeam = async (req, res) => {
    try {
        const { inviteCode } = req.body;

        const user = await Participant.findById(req.user.id);

        if (user.teamId) {
            return res.status(400).json({
                message: "You are already in a team"
            });
        }

        const team = await Team.findOne({ inviteCode });

        if (!team) {
            return res.status(404).json({
                message: "Invalid invite code"
            });
        }

        if (team.members.length >= team.maxMembers) {
            return res.status(400).json({
                message: "Team is full"
            });
        }

        team.members.push(req.user.id);
        await team.save();

        user.teamId = team._id;
        await user.save();

        // Populate members and leader before returning
        const populatedTeam = await team.populate("members leader", "name email");

        res.json({
            message: "Joined team successfully",
            team: populatedTeam
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// LEAVE TEAM
export const leaveTeam = async (req, res) => {
    try {
        const user = await Participant.findById(req.user.id);

        if (!user.teamId) {
            return res.status(400).json({
                message: "You are not in a team"
            });
        }

        const team = await Team.findById(user.teamId);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        if (team.leader.toString() === req.user.id) {
            return res.status(400).json({
                message: "Leader cannot leave the team. Transfer leadership or delete the team."
            });
        }

        team.members = team.members.filter(
            (m) => m.toString() !== req.user.id
        );
        await team.save();

        user.teamId = null;
        await user.save();

        res.json({ message: "Left team successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// REMOVE MEMBER (Leader only)

export const removeMember = async (req, res) => {
    try {
        const { memberId } = req.params;

        
        if (memberId === req.user.id) {
            return res.status(400).json({
                message: "Leader cannot remove themselves. Delete the team instead."
            });
        }

        
        const user = await Participant.findById(req.user.id);
        const team = await Team.findOne({
            _id: user.teamId,
            leader: req.user.id
        });

        if (!team) {
            return res.status(403).json({
                message: "Only the team leader can remove members"
            });
        }

        const memberExists = team.members.some(
            (m) => m.toString() === memberId
        );

        if (!memberExists) {
            return res.status(404).json({ message: "Member not found in team" });
        }

        team.members = team.members.filter(
            (m) => m.toString() !== memberId
        );
        await team.save();

        await Participant.findByIdAndUpdate(memberId, { teamId: null });

        res.json({ message: "Member removed successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE TEAM (Leader only)

export const deleteTeam = async (req, res) => {
    try {
        const user = await Participant.findById(req.user.id);

        const team = await Team.findOne({
            _id: user.teamId,
            leader: req.user.id
        });

        if (!team) {
            return res.status(403).json({
                message: "Only the team leader can delete the team"
            });
        }


        await Participant.updateMany(
            { _id: { $in: team.members } },
            { teamId: null }
        );

        await Team.findByIdAndDelete(team._id);

        res.json({ message: "Team deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};