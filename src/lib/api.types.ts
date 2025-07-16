export type PickExcept<T, K extends keyof T> = Omit<T, K>;

export interface AuthResponse {
  accessToken: string;
  permissions: string[]; // or a specific union if permissions are fixed
}

export interface ProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface FileMetadata {
  id: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  originalName: string;
}

interface PoemContent {
  title: string;
  stanzas: string[][];
}

interface Poem {
  id: string;
  content: PoemContent;
  file: FileMetadata | null;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

export interface JournalResponse {
  id: string;
  title: string;
  content: string;
  topics: string[];
  emotions: string[];
  date: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  poem: Poem | null;
  user: User;
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  lastPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface JournalPaginationResponse {
  id: string;
  title: string;
  content: string;
  topics: string[];
  emotions: string[];
  date: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface JournalsResponse {
  items: JournalPaginationResponse[];
  meta: PaginationMeta;
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
