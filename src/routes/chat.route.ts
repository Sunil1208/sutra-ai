import { chatController } from "@controllers/chat.controller";
import { FastifyInstance } from "fastify";

export async function chatRoutes(app: FastifyInstance) {
    app.post("/v1/chat", chatController.handleChat);
}
