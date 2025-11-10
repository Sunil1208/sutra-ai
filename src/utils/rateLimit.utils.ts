/**
 * Plan based rate limiting utilities
 * windowMs: time window in milliseconds
 * max: maximum number of requests allowed in the time window
 */
export const rateLimitConfig: Record<string, { windowMs: number; max: number }> = {
    free: {
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 50 // 50 requests per window
    },
    pro: {
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 200 // 200 requests per window
    },
    enterprise: {
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 500 // 500 requests per window
    }
};

export function getRateLimitForPlan(plan: string): { windowMs: number; max: number } {
    return (rateLimitConfig[plan as keyof typeof rateLimitConfig] ?? rateLimitConfig.free) as {
        windowMs: number;
        max: number;
    };
}
