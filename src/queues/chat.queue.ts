import { createQueue } from "@lib/queue.client";
import { logger } from "@utils/loggers";

const { queue: chatQueue } = createQueue("chatQueue");

/**
 * Enqueue a chat job
 * @param payload - prompt, strategy, etc.
 * @returns job id
 */
export const enqueueChatJob = async (payload: Record<string, any>) => {
    const job = await chatQueue.add("chatRequest", payload, {
        attempts: 3, // auto retry up to 3 times
        backoff: {
            // exponential backoff strategy
            type: "exponential",
            delay: 2000 // initial delay of 2 seconds
        },
        removeOnComplete: 100, // keep last 100 completed jobs
        removeOnFail: 50 // keep last 50 failed jobs
    });
    logger.info({ jobId: job.id }, "[ChatQueue] Job enqueued");
    return job.id;
};

export { chatQueue };
