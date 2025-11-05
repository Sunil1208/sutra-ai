import { ApiError } from "./ApiError";

export class ValidationError extends ApiError {
    constructor(message: string = "Validation failed", details?: unknown) {
        super(message, 400, "VALIDATION_ERROR", details);
    }
}
