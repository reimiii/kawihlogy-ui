import { ErrorDisplay } from "../components/ErrorDisplay";

export function Unauthorized() {
  return (
    <ErrorDisplay
      statusCode="401"
      title="UNAUTHORIZED ACCESS // AUTHENTICATION REQUIRED"
      message="You must be logged in to access this resource. No valid credentials were found. This attempt has been recorded."
      action={{
        text: "LOGIN TO CONTINUE",
        to: "/login",
      }}
    />
  );
}
