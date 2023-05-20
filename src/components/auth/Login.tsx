import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {useRef, useState} from "react";
import {getSession, signIn} from "next-auth/react";
import {useRouter} from "next/router";

interface Values {
  email: string,
  password: string,
}

const schema = Yup.object({
  email: Yup.string()
      .max(30, "Must be 30 characters or less")
      .email("Invalid email address")
      .required("Please enter your email"),
  password: Yup.string()
      .required("Please enter your password"),
});

const initValues = {
  email: "",
  password: "",
};

/**
 * This component is displayed to the user on the signin page during login
 * @return {any}
 */
export default function Login() {
  const [error, setError] = useState<string>();
  const loading = useRef<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values: any) => {
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
      const session = await getSession();

      router.push(`/${session?.user.role}s/${session?.user.id}`);
    }
  };

  return (
    <>
      {/** abstract onSubmit to a function */}
      <Formik
        initialValues={initValues}
        validationSchema={schema}
        onSubmit={async (values: Values) => handleSubmit(values)}
      >
        {(formik: {
            isSubmitting: boolean | undefined;
        }) => (
          <Form>
            <div className="flex flex-col ">
              <div className="text-red-400 text-md text-center rounded p-2">
                {error}
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
                className="signInButton my-8"
                disabled={(loading.current || formik.isSubmitting)}
              >
                {(loading.current || formik.isSubmitting) ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
