import { chatController } from "@controllers";
import { FastifyInstance } from "fastify";

export async function chatRoutes(app: FastifyInstance) {
    app.post("", chatController.handleChat);
}
