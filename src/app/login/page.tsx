import { getServerSession } from "next-auth";
import React from "react";
import { AuthOptions } from "../../../lib/authOptions";
import { redirect } from "next/navigation";
import LoginForm from "./Form";

const page = async () => {
    const session = await getServerSession(AuthOptions)

    if (session) {
        redirect('/');
    }
    return (
        <section className="container h-screen flex items-center justify-center">
            <div className="w-[800px]">
                <LoginForm></LoginForm>
            </div>
        </section>
    )
}
export default page