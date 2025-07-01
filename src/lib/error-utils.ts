export type FieldErrorResponse = {
  statusCode: number;
  type: string;
  message: string;
  errors: {
    formErrors: string[];
    fieldErrors: {
      [key: string]: string[];
    };
  };
};

export function isFieldErrorResponse(
  error: unknown,
): error is FieldErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "errors" in error &&
    typeof (error as any).errors === "object" &&
    "fieldErrors" in (error as any).errors
  );
}

export function getFieldErrorMessages(
  error: unknown,
  fieldLabelMap?: Record<string, string>,
): string[] {
  if (!isFieldErrorResponse(error)) return [];

  const fieldErrors = (error as FieldErrorResponse).errors.fieldErrors;

  return Object.entries(fieldErrors).flatMap(([field, messages]) => {
    const label = fieldLabelMap?.[field] ?? field;
    return messages.map((msg) => `${label}: ${msg}`);
  });
}
