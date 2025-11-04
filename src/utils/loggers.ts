import pino from "pino";
import { FastifyBaseLogger } from "fastify";
import { config } from "@config/env";

const isDev = config.NODE_ENV === "development";

export const pinoLogger = pino({
    level: config.LOG_LEVEL,
    ...(isDev && {
        transport: {
            target: require.resolve("pino-pretty"),
            options: {
                colorize: true,
                translateTime: "SYS:standard"
            }
        }
    }),
    base: {
        env: config.NODE_ENV,
        service: "sutraai-gateway"
    }
});

export const logger: FastifyBaseLogger = pinoLogger as unknown as FastifyBaseLogger; // Type casting to FastifyBaseLogger

export type Logger = typeof logger;
