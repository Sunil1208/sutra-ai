export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly details?: unknown;

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = "INTERNAL_SERVER_ERROR",
        details?: unknown
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}
