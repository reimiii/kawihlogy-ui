export interface AuthResponse {
  accessToken: string;
  permissions: string[]; // or a specific union if permissions are fixed
}

export interface ApiBaseError {
  statusCode: number;
  message: string;
  error?: string; // optional for flexibility
}

// 400 Validation Error Detail
export interface ValidationErrorDetail {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
}

export interface ValidationError extends ApiBaseError {
  type: string | "body" | "query"; // e.g. "body", "query"
  errors: ValidationErrorDetail;
}

// Unified Discriminated Union Type
export type ApiErrorResponse =
  | ValidationError // statusCode: 400
  | ApiBaseError; // fallback: 401, 403, 404, 422, 500 etc.

export class ApiError extends Error {
  readonly response: ApiErrorResponse;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = "ApiError";
    this.response = response;
  }
}
