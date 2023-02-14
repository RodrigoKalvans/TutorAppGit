import Head from "next/head";
import LoginPanel from "@/components/login/loginPanel";

export default function LoginPage() {
    return (
        <>
        <Head>
            <title>TCorvus | Log In</title>
        </Head>

        <main className=" w-full h-screen flex-col justify-center">
            <div className="font-bold flex justify-center p-5">
                TCorvus
            </div>

            <div className=" flex justify-center">
                <LoginPanel />
            </div>

        </main>
        </>
    );
}
