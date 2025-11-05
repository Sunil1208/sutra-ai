export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    timestamp: string;
}

export function sendSuccess<T>(message: string, data: T): ApiSuccessResponse<T> {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
}
