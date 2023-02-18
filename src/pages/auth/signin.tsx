import { CtxOrReq } from "next-auth/client/_utils";
import Head from "next/head";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/Signup";
import { getCsrfToken } from "next-auth/react";
import { useState } from "react";

export default function LoginPage({subjects, csrfToken}: {subjects: any, csrfToken: any}) {

    const [login, setLogin] = useState(false);

    return (
        <>
        <Head>
            <title>Sign in | TCorvus</title>
        </Head>

        <main className=" w-full h-screen flex-col justify-center">
            <div className="font-bold flex justify-center p-5">
                TCorvus
            </div>

            <div className=" flex justify-center">
                <div className="flex-col justify-center shadow-xl bg-orange-100 rounded-xl px-8 pt-6 pb-8 mb-4">
                    
                    {(login ? <Login csrfToken={csrfToken} /> : <SignUp csrfToken={csrfToken} subjects={subjects} />)}

                    <div className="flex justify-center m-3">
                        <button onClick={() => setLogin(!login)}>{(login ? "Sign up" : "Login")}</button>
                    </div>
                </div>
            </div>

        </main>
        </>
    );
}

// token used for login
export async function getServerSideProps(context: CtxOrReq | undefined) {

    // const res = await fetch("", {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //     }
    // });
    // const subjects = res.json();

    const subjects: {_id: string, name: string, tutors: string[], icon: any}[] = [];

    // plc test
    const plc1 = {
        _id: "0", 
        name: "Mathematics",
        tutors: ["lena", "nadezda"],
        icon: 0
    };
    const plc2 = {
        _id: "1", 
        name: "History",
        tutors: ["bob", "rob"],
        icon: 5
    };
    const plc3 = {
        _id: "2", 
        name: "Biology",
        tutors: ["bob", "rob"],
        icon: 5
    };
    const plc4 = {
        _id: "3", 
        name: "Physics",
        tutors: ["bob", "rob"],
        icon: 5
    };
    subjects.push(plc1);
    subjects.push(plc2);
    subjects.push(plc3);
    subjects.push(plc4);

    return {
        props: {
            csrfToken: await getCsrfToken(context),
            subjects
        },
    };
}
