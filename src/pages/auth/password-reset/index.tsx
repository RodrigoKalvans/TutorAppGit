import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik"; import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";

interface Values {
  email: string,
}

const schema = Yup.object({
  email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email"),
});

const PasswordResetPage = () => {
  const [disabled, setDisabled] = useState(false);
  const [counter, setCounter] = useState(15);
  const [requestError, setRequestError] = useState<String>();
  const [open, setOpen] = useState(false);
  const loading = useRef<boolean>(false);

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

  const handleSubmit = async (values: Values) => {
    loading.current = true;
    const res = await fetch("/api/password-reset", {
      method: "POST",
      body: JSON.stringify({email: values.email}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setOpen(true);
      setDisabled(true);
      setCounter(15);
      loading.current = false;
    } else {
      const {message} = await res.json();
      setRequestError(message);
      setDisabled(true);
      loading.current = false;
    }
  };
  return (
    <>
      <Head>
        <title>Reset password</title>
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
            <h1 className="text-2xl mb-4">Reset your password</h1>
            <p className="text-base">Type the email you used to sign up on TCorvus and we&apos;ll send you a password reset email.</p>
            <Formik
              initialValues={{email: ""}}
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
                      name="email"
                      as="input"
                      placeholder="Email"
                      className="inputField mt-2"
                    />
                    <div className="text-red-600 text-sm">
                      <ErrorMessage name="email" />
                    </div>
                    <button
                      type="submit"
                      className="submitButton my-8"
                      disabled={(loading.current || formik.isSubmitting || disabled)}
                    >
                      {(loading.current || formik.isSubmitting) ? "Sending..." : `${disabled ? `Resend the code in ${counter}` : "Send reset email"}`}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
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
            <span>Password reset email has been sent</span>
            <button type="button" onClick={() => setOpen(false)} className="ml-auto">&#10006;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordResetPage;
