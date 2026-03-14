import Submission from "../models/submission.model.js";

export const createSubmission = async (req, res) => {
    try {

        const { teamId, projectTitle, githubLink, demoLink, description } = req.body;

        const submission = await Submission.create({
            teamId,
            projectTitle,
            githubLink,
            demoLink,
            description
        });

        res.status(201).json({
            message: "Submission created successfully",
            submission
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};


export const getAllSubmissions = async (req, res) => {
    try {

        const submissions = await Submission.find().populate("teamId");

        res.json(submissions);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

export const getSubmissionById = async (req, res) => {
    try {

        const submission = await Submission.findById(req.params.id)
            .populate("teamId");

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        res.json(submission);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};


export const updateSubmission = async (req, res) => {
    try {

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        res.json({
            message: "Submission updated successfully",
            submission
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

export const deleteSubmission = async (req, res) => {
    try {

        const submission = await Submission.findByIdAndDelete(req.params.id);

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found"
            });
        }

        res.json({
            message: "Submission deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};