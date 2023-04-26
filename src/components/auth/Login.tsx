import * as Yup from "yup";

import {ErrorMessage, Field, Formik} from "formik";
import {FormEventHandler, useState} from "react";

import {signIn} from "next-auth/react";

/**
 * TODO: fill this in
 * @param {any} param0
 * @return {any}
 */
export default function Login() {
  const [error, setError] = useState(null);

  return (
    <>
      {/** abstract onSubmit to a function */}
      <Formik
        initialValues={{email: "", password: "", tenantKey: ""}}
        validationSchema={Yup.object({
          email: Yup.string()
              .max(30, "Must be 30 characters or less")
              .email("Invalid email address")
              .required("Please enter your email"),
          password: Yup.string().required("Please enter your password"),
        })}
        onSubmit={async (values: { email: any; password: any; }, {setSubmitting}: any) => {
          const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            callbackUrl: "/testAuth",
          });
          if (res?.error) {
            alert(res.error);
          } else {
            setError(null);
          }
        }}
      >
        {(formik: { handleSubmit: FormEventHandler<HTMLFormElement> | undefined; isSubmitting: any; }) => (
          <form onSubmit={formik.handleSubmit}>
            <div >
              <div className="text-red-400 text-md text-center rounded p-2">
                {error}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="uppercase text-sm text-gray-600 font-bold"
                >
                    Email
                  <Field
                    name="email"
                    aria-label="enter your email"
                    aria-required="true"
                    type="text"
                    className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                  />
                </label>
                <div className="text-red-600 text-sm">
                  <ErrorMessage name="email" />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="uppercase text-sm text-gray-600 font-bold"
                >
                    password
                  <Field
                    name="password"
                    aria-label="enter your password"
                    aria-required="true"
                    type="password"
                    className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                  />
                </label>
                <div className="text-red-600 text-sm">
                  <ErrorMessage name="password" />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-orange-500 text-gray-100 p-3 rounded-lg w-full"
                >
                  {formik.isSubmitting ? "Please wait..." : "Sign In"}
                </button>
              </div>

            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
