import Head from "next/head";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/Signup";
import {useState} from "react";
import Subject from "@/models/Subject";
import db from "@/utils/db";

/** Login page
 * @return {any} yo
 */
export default function LoginPage({subjects}: {subjects: any}) {
  const [login, setLogin] = useState(true);

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
          <div className="flex-col justify-center w-1/4 shadow-xl bg-gray-100 rounded-xl px-8 pt-6 pb-8 mb-4">

            {(login ? <Login /> : <SignUp subjects={subjects} />)}

            <div className="flex justify-center m-3">
              <button onClick={() => setLogin(!login)}>{(login ? "Sign up" : "Login")}</button>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}

/**
 * yo
 * @return {any}
 */
export async function getStaticProps() {
  await db.connect();
  const subjects = await Subject.find();
  await db.disconnect();

  return {
    props: {
      subjects: JSON.parse(JSON.stringify(subjects)),
    },
    revalidate: 3600,
  };
}
