import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { sendRegistrationEmail } from "../services/email.service.js";

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        const { email, name } = job.data;

        await sendRegistrationEmail(email, name);
    },
    { connection }
);

console.log("Email worker started");