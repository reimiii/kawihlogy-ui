import { ErrorDisplay } from "../components/ErrorDisplay";

export default function Forbidden() {
  return (
    <ErrorDisplay
      statusCode="403"
      title="Access Forbidden"
      message="You do not have the required permissions to view this page. Access has been logged and reported."
      action={{
        text: "Return Home",
        to: "/",
      }}
    />
  );
}
