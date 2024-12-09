import Dashboard from "./api/auth/[...nextauth]/components/Dashboard";
import { getServerSession, Session } from "next-auth";



export default async  function Home() {
  const session = await getServerSession () as Session
  return (
    <main className="max-w-7xl mx-auto my-12 space-y-5">
      <Dashboard session = {session}/>
    </main>
  );
}
