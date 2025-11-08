import { FastifyReply, FastifyRequest } from "fastify";
import { ChatSchemas } from "@schemas";
import { sendSuccess } from "@root/utils/response.utils";
import { orchestratorService } from "@services";

const { Request: ChatRequestSchema, Response: ChatResponseSchema } = ChatSchemas;

export const chatController = {
    async handleChat(req: FastifyRequest, reply: FastifyReply) {
        // Validate request
        const payload = req.server.validate(ChatRequestSchema, req.body);

        const { messages, model } = payload;
        const userPrompt = messages.map((m) => m.content).join("\n");

        const result = await orchestratorService.routePrompt(userPrompt, model as any);

        const response = {
            success: true,
            modelUsed: result.model,
            output: result.output,
            latencyMs: result.latencyMs,
            cached: result.cached
        };

        const validated = req.server.validate(ChatResponseSchema, response);
        return reply.code(200).send(sendSuccess("Chat processed successfully", validated));
    }
};
