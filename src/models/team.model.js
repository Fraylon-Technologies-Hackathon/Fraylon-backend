import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String
    },

    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
        required: true
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Participant"
        }
    ],

    maxMembers: {
        type: Number,
        default: 4
    },

    inviteCode: {
        type: String,
        unique: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Team", teamSchema);