import {CtxOrReq} from "next-auth/client/_utils";
import Head from "next/head";
import Login from "@/components/auth/Login";
import SignUp from "@/components/auth/Signup";
import {getCsrfToken} from "next-auth/react";
import {useState} from "react";

/** Login page
 * @return {any} yo
 */
export default function LoginPage({subjects, csrfToken}: {subjects: any, csrfToken: any}) {
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
          <div className="flex-col justify-center w-1/4 shadow-xl bg-orange-100 rounded-xl px-8 pt-6 pb-8 mb-4">

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

/**
 * yo
 * @param {any} context a
 * @return {any}
 */
export async function getServerSideProps(context: CtxOrReq | undefined) {
  const res = await fetch("http://localhost:3000/api/subjects", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    props: {
      csrfToken: await getCsrfToken(context),
      subjects: await res.json(),
    },
  };
}
