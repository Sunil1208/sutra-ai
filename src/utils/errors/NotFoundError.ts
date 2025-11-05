import { ApiError } from "./ApiError";

export class NotFoundError extends ApiError {
    constructor(message: string = "Resource not found", details?: unknown) {
        super(message, 404, "NOT_FOUND", details);
    }
}
