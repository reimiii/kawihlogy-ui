import { useParams } from "react-router";
import { JournalList } from "../components/JournalList";

export function JournalListByUser() {
  const { userId } = useParams<{ userId: string }>();
  return <JournalList userId={userId} />;
}
