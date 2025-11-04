import { FastifyReply, FastifyRequest } from "fastify";

export const getHealth = async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({
        status: "ok",
        service: "sutra-ai",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
};
