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
      const userToSignUp: TUser = {
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

        userToSignUp.priceForLessons = map;
      }

      // post new user to the database
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(userToSignUp),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json= await res.json();

      // sign the user in and redirect to their profile
      if (res.ok && role === "student") {
        const {user: createdStudent} = json;
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: `/${createdStudent.role}s/${createdStudent._id.toString()}`,
        });
        if (res?.error) {
          setError(res.error);
        } else {
          setError(null);
        }
      } else if (res.ok && role === "tutor") {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res?.error) {
          setError(res.error);
        } else {
          setError(null);
          const subscribeRes = await fetch("/api/subjects/subscribeTutorToSubjects", {
            method: "PUT",
            body: JSON.stringify({
              subjectIds: chosenSubjects,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!subscribeRes.ok) {
            console.warn(res);
            throw res;
          } else {
            const {user: createdTutor} = json;

            router.push(`/${createdTutor.role}s/${createdTutor._id.toString()}`);
          }
        }
      } else if (!res.ok) {
        const {message} = json;
        setError(message);
      }
    } catch (e) {
      console.log(e);
      router.push("/_error");
    }
  };

  return (
    <>
      <div className="btn-group gap-[3px] w-full mb-4">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`btn btn-sm w-1/2 border-none capitalize
            ${role === "student" ? "blue" : " bg-gray-400 hover:bg-gray-500"}`} >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole("tutor")}
          className={`btn btn-sm w-1/2 border-none capitalize
            ${role === "tutor" ? "blue" : " bg-gray-400 hover:bg-gray-500"}`}>
            Tutor
        </button>
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
                {error && (
                  <div className="text-red-600 text-md text-center rounded p-2">
                    {error}
                  </div>
                )}
                {/*  */}
                <div>
                  <Field
                    name="firstName"
                    as="input"
                    placeholder="First name"
                    className="inputField mt-2"
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
                    className="inputField mt-2"
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
                    className="inputField mt-2"
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
                    className="inputField mt-2"
                  />
                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="password" />
                  </div>
                </div>

                {role === "tutor" && (
                  <>
                    <div className="mt-5">
                      <SubjectSelect setSubjectsState={setChosenSubjects} subjects={subjects} />
                    </div>
                    <div className="text-sm text-red-600">
                      <ErrorMessage name="subjects" />
                    </div>

                    <table className="table table-compact mt-5">
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

                <div className="flex gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="terms"
                    value="check"
                    className="cursor-pointer"
                    required
                  />

                  {/** TODO: link Terms to ToS */}
                  <label htmlFor="terms" className="text-xs">Agree to our <Link href="/" >Terms</Link></label>
                </div>

                <div className="flex gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="newslettersCheck"
                    value="check"
                    className="cursor-pointer"
                    onChange={() => setSubscribed(!subscribed)}
                    defaultChecked
                  />

                  <label htmlFor="newslettersCheck" className="text-xs">Subscribe to our newsletters</label>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className="signInButton my-8"
                    disabled={formik.isSubmitting}
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
