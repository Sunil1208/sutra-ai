import { FastifyReply, FastifyRequest } from "fastify";
import { ChatRequestSchema, ChatResponseSchema } from "@root/schemas/chat.schema";
import { sendSuccess } from "@root/utils/response.utils";

export const chatController = {
    async handleChat(req: FastifyRequest, reply: FastifyReply) {
        // Validate request
        const payload = req.server.validate(ChatRequestSchema, req.body);

        // Moch orchestration logic
        const mockModel = payload.model || "auto";
        const mockResponse = {
            success: true,
            modelUsed: mockModel,
            output: `This is a mock response from model ${mockModel}.`,
            latencyMs: 30,
            cached: false
        };

        // Validate & send response
        req.server.validate(ChatResponseSchema, mockResponse);
        return reply.code(200).send(sendSuccess("Chat processed successfully", mockResponse));
    }
};
