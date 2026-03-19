import { getCandidates, getUserVote } from "@/app/actions/election";
import ElectionClient from "./components/ElectionClient";

export const dynamic = "force-dynamic";

export default async function ElectionPage() {
  const [candidates, userVote] = await Promise.all([
    getCandidates(),
    getUserVote()
  ]);

  return (
    <ElectionClient 
      initialCandidates={candidates} 
      initialUserVote={userVote} 
    />
  );
}
