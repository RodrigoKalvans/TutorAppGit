import EmailVerification from "@/models/EmailVerification";
import {verifyEmailToken} from "@/utils/apiHelperFunction/verificationHelper";
import db from "@/utils/db";
import {GetServerSidePropsContext} from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";

const VerificationPage = ({success, error, email}: {success?: boolean, error?: string, email? : string}) => {
  const [disabled, setDisabled] = useState(true);
  const [counter, setCounter] = useState(15);
  const [requestError, setRequestError] = useState<String>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer: number;
    if (disabled && counter > 0) timer = window.setTimeout(() => setCounter((c) => c-1), 1000);
    if (counter === 0) setDisabled(false);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [disabled, counter]);

  const handleEmailResend = async () => {
    const res = await fetch("/api/verification", {
      method: "POST",
      body: JSON.stringify({email: email}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setOpen(true);
      setDisabled(true);
      setCounter(15);
    } else {
      const {message} = await res.json();
      setRequestError(message);
      setDisabled(true);
    }
  };

  const header = error ? error : "Verify you email address";

  return (
    <>
      <Head>
        <title>Verify you email</title>
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
            {!success ? (
              <>
                <h1 className="text-2xl mb-4">{header}</h1>
                {!error && (
                  <p>
              We&apos;ve sent you an email with the verification link to your email address. Please check your inbox and click the link to activate your account (don&apos;t forget to check your spam box).
                  </p>
                )}

                {(email && !error) && (
                  <>
                    <p className="text-sm mt-8">
              If you have not received the link you can request another one in {counter}
                    </p>
                    <button
                      className="btn btn-sm border-none orange capitalize"
                      onClick={handleEmailResend}
                      disabled={disabled}
                    >
              Resend link
                    </button>
                    {requestError && <p className="text-sm mt-4 text-red-900">{requestError}</p>}
                  </>
                )}
              </>) : (
                <>
                  <h1 className="text-2xl">Your email is successfully verified!</h1>
                  <p>You can now <Link href={"/auth/signin"} className="cursor-pointer underline hover:opacity-80 transition-all">log in</Link> to your account.</p>
                </>
              )
            }
          </div>

        </div>

        <div className="min-h-screen h-full w-full  hidden md:flex items-center">

          <div className="ml-8">
            <p className="font-black text-6xl text-light">Verify your email.</p>
          </div>
        </div>
      </main>

      {open && (
        <div className="alert alert-success shadow-lg fixed left-1/2 w-[90%] -translate-x-1/2 top-2">
          <div className="flex w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>New verification email has been sent!</span>
            <button type="button" onClick={() => setOpen(false)} className="ml-auto">&#10006;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationPage;

/**
 * Retrieves server-side props for the page. Checks if token exists and then verifies the email
 * @param {GetServerSidePropsContext} context - The context object containing information about the request.
 * @return {Promise<{props: object}>} A promise that resolves to an object with the server-side props.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.query.token && !context.query.email) {
    return {
      props: {},
    };
  }

  await db.connect();

  if (!context.query.token && context.query.email) {
    const {email} = context.query;

    const emailVerificationEntry = await EmailVerification.findOne({email: email});

    if (!emailVerificationEntry) {
      return {
        props: {
          error: JSON.parse(
              JSON.stringify("User with this email is not registered or has already verified their account"),
          ),
        },
      };
    }
    return {
      props: {
        email: JSON.parse(JSON.stringify(context.query.email)),
      },
    };
  }

  const {token} = context.query;
  const result = await verifyEmailToken(token as string);

  // await db.disconnect();

  if (result.error) {
    return {
      props: {
        error: JSON.parse(JSON.stringify(result.error)),
      },
    };
  }

  return {
    props: {
      success: true,
    },
  };
}
