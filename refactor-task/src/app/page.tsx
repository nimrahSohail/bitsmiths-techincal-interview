import Table, { Issue } from "./components/table";
import IssuesData from "./constants/issues.json";

export default function Home() {
  return <Table issues={IssuesData as Issue[]} />;
}
