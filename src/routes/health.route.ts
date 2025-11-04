import { getHealth } from "@controllers/health.controller";
import { FastifyInstance } from "fastify";

export default async function healthRoute(app: FastifyInstance) {
    app.get("/", getHealth);
}
