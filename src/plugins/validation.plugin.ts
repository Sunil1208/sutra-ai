import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { ZodType, ZodError } from "zod";

/**
 * Decorator: app.validate(schema). Ensures payload matches a Zod schema.
 */
async function validationPluginFn(app: FastifyInstance) {
    app.decorate("validate", <T>(shema: ZodType<T>, payload: unknown): T => {
        const result = shema.safeParse(payload);
        if (!result.success) {
            const zodError = result.error as ZodError;
            const message = zodError.issues
                .map((e) => `${e.path.join(".")}: ${e.message}`)
                .join(", ");
            const err: any = new Error(message);
            err.statusCode = 400;
            err.code = "VALIDATION_ERROR";
            throw err;
        }
        return result.data;
    });
}

export const validationPlugin = fp(validationPluginFn, {
    name: "validationPlugin"
});

declare module "fastify" {
    interface FastifyInstance {
        validate: <T>(shema: ZodType<T>, payload: unknown) => T;
    }
}
