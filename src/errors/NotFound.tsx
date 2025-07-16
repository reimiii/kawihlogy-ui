import { ErrorDisplay } from "../components/ErrorDisplay";

export default function NotFound() {
  return (
    <ErrorDisplay
      statusCode="404"
      title="Resource Not Found"
      message="The page you were looking for could not be found. It may have been moved, deleted, or never existed in the first place."
      action={{
        text: "Return Home",
        to: "/",
      }}
    />
  );
}
