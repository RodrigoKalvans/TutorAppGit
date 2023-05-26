import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik"; import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {GetServerSidePropsContext} from "next";
import db from "@/utils/db";
import {verifyPasswordResetToken} from "@/utils/apiHelperFunction/verificationHelper";
import {useRouter} from "next/router";
import YupPassword from "yup-password";

YupPassword(Yup);

interface Values {
  password: string,
}

const schema = Yup.object({
  password: Yup.string()
      .min(10, "Password must be at least 10 characters")
      .minLowercase(1, "Password must contain at least 1 lower case letter")
      .minUppercase(1, "Password must contain at least 1 upper case letter")
      .minNumbers(1, "Password must contain at least 1 number")
      .minSymbols(1, "Password must contain at least 1 special character")
      .required("Please enter your password"),
});

const PasswordResetPage = ({error, success, email}: {error?: string, success?: boolean, email?: string}) => {
  const [requestError, setRequestError] = useState<String>();
  const [open, setOpen] = useState(false);

  const loading = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    let timer: number;
    if (open) timer = window.setTimeout(() => router.push("/auth/signin"), 4000);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [open, router]);

  const header = error ? error : "Reset your password";

  const handleSubmit = async (values: Values) => {
    if (!email) return;

    loading.current = true;
    const res = await fetch("/api/password-reset", {
      method: "PUT",
      body: JSON.stringify({
        email: email,
        password: values.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setOpen(true);
    } else {
      const {message} = await res.json();
      setRequestError(message);
      loading.current = false;
    }
  };
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
          <div className="w-3/5 text-center">
            <h1 className="text-2xl mb-4">{header}</h1>
            {success && (
              <>
                <p className="text-base">Type your new password.</p>
                <Formik
                  initialValues={{password: ""}}
                  validationSchema={schema}
                  onSubmit={async (values: Values) => handleSubmit(values)}
                >
                  {(formik: {isSubmitting: boolean | undefined;}) => (
                    <Form>
                      <div className="flex flex-col ">
                        <div className="text-red-600 text-md text-center rounded p-2">
                          {requestError}
                        </div>
                        <Field
                          name="password"
                          type="password"
                          as="input"
                          placeholder="Password"
                          className="inputField mt-2"
                        />
                        <div className="text-red-600 text-sm">
                          <ErrorMessage name="password" />
                        </div>
                        <button
                          type="submit"
                          className="submitButton my-8"
                          disabled={(loading.current || formik.isSubmitting || !email)}
                        >
                          {(loading.current || formik.isSubmitting) ? "Resetting..." : "Reset password"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </div>

        </div>
        <div className="min-h-screen h-full w-full bg-blue-900 hidden md:flex items-center">

          <div className="ml-8">
            <p className="font-black text-6xl text-light">Forgot Password</p>
            <p className="font-medium text-light">You are not alone. We&apos;ve all been here at some point.</p>
          </div>
        </div>
      </main>

      {open && (
        <div className="alert alert-success shadow-lg fixed left-1/2 w-[90%] -translate-x-1/2 top-2">
          <div className="flex w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Password has been reset. You will be redirected to sign in page.</span>
            <button type="button" onClick={() => setOpen(false)} className="ml-auto">&#10006;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordResetPage;

/**
 * Retrieves server-side props for the page. Checks if token exists and then verifies it
 * @param {GetServerSidePropsContext} context - The context object containing information about the request.
 * @return {Promise<{props: object}>} A promise that resolves to an object with the server-side props.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  await db.connect();

  const {token} = context.query;
  const result = await verifyPasswordResetToken(token as string);

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
      email: result.email,
    },
  };
}
