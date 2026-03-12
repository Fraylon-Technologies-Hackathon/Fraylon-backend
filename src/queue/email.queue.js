import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const emailQueue = new Queue("emailQueue", {
    connection
});

export default emailQueue;