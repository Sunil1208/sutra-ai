import { z } from "zod";

/**
 * Request schema example.
 * For '/health', we don't need inputs,
 */
export const HealthRequestSchema = z.object({});

/**
 * Response schema for '/health' endpoint.
 */
export const HealthResponseSchema = z.object({
    success: z.boolean(),
    status: z.string(),
    service: z.string(),
    uptime: z.number(),
    timestamp: z.string()
});

export type HealthResponseType = z.infer<typeof HealthResponseSchema>;
