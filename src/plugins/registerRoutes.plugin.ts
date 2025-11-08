import { chatRoutes } from "@root/routes/chat.route";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

async function registerRoutesPlugin(app: FastifyInstance) {
    app.register(chatRoutes);
}

export default fp(registerRoutesPlugin, {
    name: "registerRoutesPlugin"
});
