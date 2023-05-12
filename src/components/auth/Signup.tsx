import * as Yup from "yup";

import {ErrorMessage, Field, Form, Formik} from "formik";
import {FormEventHandler, useState} from "react";

import Link from "next/link";
import SubjectSelect from "../SubjectSelect";
import YupPassword from "yup-password";
import {signIn} from "next-auth/react";
import router from "next/router";

YupPassword(Yup);

type TUser = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string,
  priceForLessons?: {},
  subjects: Array<any>,
  subscribeToNewsletters?: boolean,
}

const schema = Yup.object({
  email: Yup.string()
      .max(30, "Must be 30 characters or less")
      .email("Invalid email address")
      .required("Please enter your email"),
  password: Yup.string()
      .min(10, "Password must be at least 10 characters")
      .minLowercase(1, "Password must contain at least 1 lower case letter")
      .minUppercase(1, "Password must contain at least 1 upper case letter")
      .minNumbers(1, "Password must contain at least 1 number")
      .minSymbols(1, "Password must contain at least 1 special character")
      .required("Please enter your password"),
  firstName: Yup.string()
      .max(30, "Must be 30 characters or less")
      .required("Please enter your name"),
  lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Please enter your last name"),
});

/**
 * this component is displayed on the sign in page during signup
 * @param {Array<any>} subjects
 * @return {JSX}
 */
export default function SignUp({
  subjects,
} : {
  subjects: Array<any>
}) {
  const [error, setError] = useState<any>(undefined);

  // only for tutors
  const [minutes, setMinutes] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(undefined);
  const [chosenSubjects, setChosenSubjects] = useState<Array<any> | undefined>(undefined);
  const [role, setRole] = useState<string>("student");

  // Newsletter checkbox
  const [subscribed, setSubscribed] = useState<boolean>(true);

  const onSubmit = async (values: any) => {
    try {
      // define object to be sent via HTTP
      const user: TUser = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: role,
        subjects: chosenSubjects || [],
        subscribeToNewsletters: subscribed,
      };

      // changes entered prices to proper format
      if (role === "tutor") {
        const temp = new Map();
        temp.set(minutes, price);

        // what type is this shit?
        const map: any = {};
        temp.forEach((val: string, key: string) => {
          map[key] = val;
        });

        user.priceForLessons = map;
      }

      // post new user to the database
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await res.json();

      // sign the user in and redirect
      if (res.ok) {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          // callbackUrl: `/${role}s/${json.user._id.toString()}`,
        });
        if (res?.error) {
          setError(res.error);
        } else {
          setError(null);
        }
      } else {
        // TODO: handle errors better
        console.error(json);
      }

      if (role == "tutor") {
        const res = await fetch("/api/subjects/subscribeTutorToSubjects", {
          method: "PUT",
          body: JSON.stringify({
            subjectIds: chosenSubjects,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          console.warn(res);
          throw res;
        }
      }
    } catch (e) {
      console.log(e);
      router.push("/_error");
    }
  };

  return (
    <>
      <div className="btn-group w-full">
        <button onClick={() => setRole("student")} className="btn w-1/2 bg-orange-400 hover:bg-orange-500" >Student</button>
        <button onClick={() => setRole("tutor")} className="btn w-1/2 bg-orange-400 hover:bg-orange-500">Tutor</button>
      </div>
      <Formik
        initialValues={{firstName: "", lastName: "", email: "", password: "", tenantKey: ""}}
        validationSchema={schema}
        onSubmit={async (values: { firstName: string; lastName: string; email: string; password: string; }) => onSubmit(values)}
      >
        {(formik: { handleSubmit: FormEventHandler<HTMLFormElement> | undefined; isSubmitting: any; }) => (
          <>
            <Form onSubmit={formik.handleSubmit}>
              <div >
                <div className="text-red-400 text-md text-center rounded p-2">
                  {error}
                </div>
                <div>
                  <Field
                    name="firstName"
                    as="input"
                    placeholder="First name"
                    className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                  />
                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="firstName" />
                  </div>
                </div>
                <div>
                  <Field
                    name="lastName"
                    as="input"
                    placeholder="Last name"
                    className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                  />
                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="lastName" />
                  </div>
                </div>
                <div>
                  <Field
                    name="email"
                    as="input"
                    placeholder="Email"
                    className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                  />
                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="email" />
                  </div>
                </div>
                <div>
                  <Field
                    name="password"
                    type="password"
                    as="input"
                    placeholder="Password"
                    className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                  />
                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="password" />
                  </div>
                </div>

                {role === "tutor" && (
                  <>
                    <div className="mt-1">
                      <SubjectSelect setSubjectsState={setChosenSubjects} subjects={subjects} />
                    </div>
                    <div className="text-sm text-red-600">
                      <ErrorMessage name="subjects" />
                    </div>

                    <table className="table table-compact z-0">
                      <thead>
                        <tr className="text-left">
                          <th className="font-light text-sm capitalize">minutes</th>
                          <th className="font-light text-sm capitalize">price (euro)</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="w-fit"><input
                            type="number"
                            id="minutes"
                            defaultValue={0}
                            onChange = {
                              (e) => {
                                try {
                                  setMinutes(e.target.value);
                                } catch (e) {
                                  alert("price must be a number");
                                }
                              }
                            }
                            className="w-full"
                          /></td>
                          <td className="w-fit"><input
                            type="number"
                            id="price"
                            defaultValue={0}
                            onChange = {
                              (e) => {
                                try {
                                  setPrice(e.target.value);
                                } catch (e) {
                                  alert("price must be a number");
                                }
                              }
                            }
                            className="w-full"
                          /></td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}

                <div className="flex justify-center p-3">
                  <input
                    type="checkbox"
                    id="terms"
                    value="check"
                    className="checkbox-xs"
                    required
                  />

                  {/** TODO: link Terms to ToS */}
                  <label htmlFor="terms" className="text-xs">Agree to our <Link href="/" >Terms</Link></label>
                </div>

                <div className="flex justify-center p-3">
                  <input
                    type="checkbox"
                    id="newslettersCheck"
                    value="check"
                    className="checkbox-xs"
                    onChange={() => setSubscribed(!subscribed)}
                    checked
                  />

                  <label htmlFor="newslettersCheck" className="text-xs">Subscribe to our newsletters</label>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="bg-orange-400 hover:bg-orange-500 w-full text-gray-100 p-3 rounded-lg"
                  >
                    {formik.isSubmitting ? "Please wait..." : "Sign Up"}
                  </button>
                </div>

              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
