import { Link } from "react-router";

export function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline"> Hello world! </h1>
      <h1>Welcome to Journal App</h1>
      <Link to="/login">Login</Link> | <Link to="/register">Login</Link>
    </div>
  );
}
