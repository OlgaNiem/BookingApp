"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 

    if (session?.user?.role === "admin") {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  return <p>Redirecting...</p>;
}
