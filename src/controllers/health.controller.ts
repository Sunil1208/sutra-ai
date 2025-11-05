import { HealthRequestSchema, HealthResponseSchema } from "@root/schemas/health.schema";
import { sendSuccess } from "@utils/response.utils";
import { FastifyReply, FastifyRequest } from "fastify";

export const getHealth = async (req: FastifyRequest, reply: FastifyReply) => {
    // Validate request body/query (none here)
    req.server.validate(HealthRequestSchema, {});

    const data = {
        success: true,
        status: "ok",
        service: "sutra-ai",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    };

    // Validate response before sending
    req.server.validate(HealthResponseSchema, data);
    return reply.code(200).send(sendSuccess("Service healthy", data));
};
