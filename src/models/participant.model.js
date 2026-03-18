import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    college: {
        type: String
    },

    phone: {
        type: String
    },

    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
     
    role: {
        type: String,
        enum: ["participant", "admin"],
        default: "participant"
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Participant = mongoose.model("Participant", participantSchema);

export default Participant;