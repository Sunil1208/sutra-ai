import { FastifyInstance } from "fastify";

export async function loggingPlugin(app: FastifyInstance) {
    app.addHook("onRequest", async (req) => {
        app.log.info({ method: req.method, url: req.url }, " -> Incoming request");
    });

    app.addHook("onResponse", async (req, reply) => {
        app.log.info(
            {
                method: req.method,
                url: req.url,
                statusCode: reply.statusCode
            },
            " <- Response sent"
        );
    });
}
