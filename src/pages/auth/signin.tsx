import Login from "@/components/auth/Login";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const SignIn = () => {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <main className="flex min-h-screen h-full">
        <div className="flex flex-col items-center justify-center w-full bg-white">
          <Link href="/">
            <Image
              src="/logo.png"
              width={70}
              height={70}
              alt={"logo"}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                margin: "0.5rem",
              }}
            />
          </Link>
          <div className="w-1/2 text-center">
            <h1 className="text-2xl mb-4">Sign in</h1>
            <Login />
            <p className="text-sm">
              Don&apos;t have an account? <Link href="/auth/signup" className="underline hover:opacity-80 transition">Sign up</Link>
            </p>
          </div>

        </div>
        <div className="min-h-screen h-full w-full bg-blue-900 flex items-center md:hidden">

          <div className="ml-8">
            <p className="font-black text-6xl text-light">Welcome back!</p>
            <p className="font-medium text-light">It is always nice to have you here. Hope you&apos;ve had a nice day :)</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignIn;
