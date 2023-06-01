import Signup from "@/components/auth/Signup";
import Subject from "@/models/Subject";
import db from "@/utils/db";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const SignUpPage = ({subjects}: {subjects: any[]}) => {
  return (
    <>
      <Head>
        <title>TCorvus | Sign up</title>
      </Head>

      <main className="flex min-h-screen h-full bg-blue-900">
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

          <div className="w-3/5 mt-7 text-center">
            <h1 className="text-2xl mb-4 md:hidden">Sign up</h1>
            <Signup subjects={subjects} />
            <p className="text-sm">
              Already have an account? <Link href="/auth/signin" className="underline hover:opacity-80 transition">Sign in</Link>
            </p>
          </div>

        </div>

        <div className="min-h-screen h-full w-full  hidden md:flex items-center">

          <div className="ml-8">
            <p className="font-black text-6xl text-light">Create an account.</p>
            <p className="font-medium text-light">Thank you for visiting, dear guest! Complete the sign up process and use our platform to the fullest.</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignUpPage;

/**
 * pre-load subjects
 * @return {any} props
 */
export async function getStaticProps() {
  await db.connect();
  const subjects = await Subject.find();
  // await db.disconnect();

  return {
    props: {
      subjects: JSON.parse(JSON.stringify(subjects)),
    },
    revalidate: 3600,
  };
}
