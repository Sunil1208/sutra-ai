import { healthController } from "@controllers";
import { FastifyInstance } from "fastify";

export async function healthRoute(app: FastifyInstance) {
    app.get("/", healthController.getHealth);
}
