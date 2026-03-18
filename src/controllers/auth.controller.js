import Participant from "../models/participant.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import emailQueue from "../queue/email.queue.js";


export const registerParticipant = async (req, res) => {
    try {

        const { name, email, password, college, phone } = req.body;

        const existingUser = await Participant.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const participant = await Participant.create({
            name,
            email,
            password: hashedPassword,
            college,
            phone
        });

        res.status(201).json({
            message: "Registration successful",
            user: {
                id: participant._id,
                name: participant.name,
                email: participant.email,
                teamId: participant.teamId
            }
        });
        await emailQueue.add("sendRegistrationEmail", {
            email: participant.email,
            name: participant.name
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

export const loginParticipant = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await Participant.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                teamId: user.teamId
            }
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};