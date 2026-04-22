export interface BaseError {
    success: false;
    message: string;
    timestamp?: string;
    path?: string;
}

export interface ValidationErrorItem {
    type?: string;
    msg: string;
    path: string;
    location: string;
}

export interface ValidationError extends BaseError {
    errors: ValidationErrorItem[];
}

export type ApiError = ValidationError | BaseError;
