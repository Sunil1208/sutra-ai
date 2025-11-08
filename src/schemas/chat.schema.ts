import { z } from "zod";

export const ChatRequestSchema = z.object({
    model: z.string().optional().default("auto"), // gpt-3.5-turbo, gpt-4, claude, gemini, etc.
    messages: z.array(
        z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string().min(1)
        })
    )
});

export const ChatResponseSchema = z.object({
    success: z.boolean(),
    modelUsed: z.string(),
    output: z.string(),
    latencyMs: z.number(),
    cached: z.boolean().optional()
});

export type ChatRequestType = z.infer<typeof ChatRequestSchema>;
export type ChatResponseType = z.infer<typeof ChatResponseSchema>;
