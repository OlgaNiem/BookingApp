'use client'
import { signIn, signOut, useSession } from "next-auth/react"
import React from "react"
import { Session } from "next-auth"

interface DashboardProps {
    session: Session | null; 
  }

const Dashboard: React.FC<DashboardProps> = ({session} ) => {
   
    return (
        <>
        {session ? (
            <> 
                <img src={session.user?.image as string} className="rounded-full h-20 w-20"></img>
                <h1 className="text-3xl text-green-500 font-bold"> Welcome back, {session.user?.name}</h1>
                <p>{session.user?.email}</p>
                <button onClick={() => signOut()} className="border border-black rounded-lg px-5 py-1">Sign Out</button>
            </>
        ): (
            <> 
                <h1 className="text-3xl text-red-500 font-bold">You are not logged in</h1>
                <div className="flex space-x-5 mt">
                    <button onClick={() => signIn("google")} className="border border-black rounded-lg px-5 py-1">Sign in with Google</button>
                    <button onClick={() => signIn("github")} className="border border-black rounded-lg px-5 py-1">Sign in with Github</button>
                </div>
            </>
        )}
        </>
    )
}

export default Dashboard