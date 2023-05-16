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
        <title>Sign in</title>
      </Head>

      <main className="container">
        <div className="flex flex-col items-center justify-center min-h-screen bg-white h-full">
          <Image
            src="/logo.png"
            width={100}
            height={100}
            alt={"logo"}
          />

          <div className="w-1/4 mt-7 text-center">
            <h1 className="text-3xl mb-5">Sign up</h1>
            <Signup subjects={subjects} />
            <p className="text-sm">
              Already have an account? <Link href="/auth/signin" className="underline">Sign in</Link>
            </p>
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
