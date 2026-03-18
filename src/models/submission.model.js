import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },

    projectTitle: {
        type: String,
        required: true
    },

    githubLink: {
        type: String,
        required: true
    },

    demoLink: {
        type: String
    },

    description: {
        type: String
    },

    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;