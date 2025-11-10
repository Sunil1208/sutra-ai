import { getCache } from "@utils/cache.utils";
import { logger } from "@utils/loggers";
import { FastifyInstance } from "fastify";

/**
 * GET /v1/jobs/:id
 * Returns job result or status stored by chat.worker.ts
 */
export async function jobsRoute(app: FastifyInstance) {
    app.get("/v1/jobs/:id", async (req, reply) => {
        const { id } = req.params as { id: string };
        const raw = await getCache(`job:${id}`);

        if (!raw) {
            logger.warn({ id }, "[JobsRoute] Job not found or expired");
            return reply.status(404).send({ success: false, error: "Job not found or expired" });
        }

        const parsed = JSON.parse(raw);
        return reply.send({
            success: true,
            jobId: id,
            ...parsed
        });
    });
}
