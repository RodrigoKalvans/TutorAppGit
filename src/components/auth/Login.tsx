import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useRef, useState} from "react";
import {getSession, signIn} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";

interface Values {
  email: string,
  password: string,
}

/**
 * TODO: fill this in
 * @param {any} param0
 * @return {any}
 */
export default function Login() {
  const [error, setError] = useState<string>();
  const loading = useRef<boolean>(false);
  const router = useRouter();

  return (
    <>
      {/** abstract onSubmit to a function */}
      <Formik
        initialValues={{email: "", password: ""}}
        validationSchema={Yup.object({
          email: Yup.string()
              .max(30, "Must be 30 characters or less")
              .email("Invalid email address")
              .required("Please enter your email"),
          password: Yup.string().required("Please enter your password"),
        })}
        onSubmit={async (values: Values) => {
          loading.current = true;
          const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (res?.error) {
            setError(res.error);
            loading.current = false;
          } else {
            const session: Session | null = await getSession();

            router.push(`/${session?.user.role}s/${session?.user.id}`);
          }
        }}
      >
        {() => (
          <Form>
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
                  disabled={loading.current}
                  className="bg-orange-500 text-gray-100 p-3 rounded-lg w-full"
                >
                  {loading.current ? "Logging in..." : "Sign In"}
                </button>
              </div>

            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
