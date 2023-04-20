import * as Yup from "yup";

import {ErrorMessage, Field, Formik} from "formik";
import {FormEventHandler, useState} from "react";

import Link from "next/link";
import SubjectSelect from "../SubjectSelect";
import YupPassword from "yup-password";
import {signIn} from "next-auth/react";

YupPassword(Yup);

/**
 * TODO: fill this in
 * @param {any} param0
 * @return {any} yo
 */
export default function SignUp({csrfToken, subjects}: {csrfToken: any, subjects: any}) {
  const [error, setError] = useState<any>(null);

  // only for tutors
  const [minutes, setMinutes] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [chosenSubjects, setSubjects] = useState<any>();

  // Newsletter checkbox
  const [subscribed, setSubscribed] = useState<boolean>(false);

  // change roll on button clicks
  const [role, setRole] = useState<string>("student");

  /** DEPRECATED
  * called when sending PUT request to update tutor subjects
  * condense subjects down to id[]
  * @return {string[]} reference to string[] with subject ids
  */
  // const getArrayOfChosenSubjectIds = () => {
  //   const placeholder: string[] = [];
  //   if (chosenSubjects) {
  //     for (let i = 0; i < chosenSubjects.length; i++) {
  //       placeholder.push(chosenSubjects.at(i).value);
  //     }
  //   }
  //   console.log(placeholder);
  //   return placeholder;
  // };

  const onSubmit = async (values: any) => {
    try {
      // define object to be sent via HTTP
      const user: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: string,
        priceForLessons?: {},
        subscribeToNewsletters?: boolean,
      } = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: role,
      };

      if (subscribed) user.subscribeToNewsletters = true;

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
      const res = await fetch("http://localhost:3000/api/auth/signup", {
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
          callbackUrl: `/${role}s/${json.user._id.toString()}`,
        });
        if (res?.error) {
          setError(res.error);
        } else {
          setError(null);
        }
      } else {
        console.log(res);
      }

      // if user is a tutor, send patch request to update subjects
      if (role === "tutor") {
        const res = await fetch("http://localhost:3000/api/subjects/subscribeTutorToSubjects", {
          method: "PUT",
          body: JSON.stringify({
            subjectIds: chosenSubjects,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw res;
        }
      }
    } catch (e) {
      // TODO: redirect to error page
      console.log(e);
      setError(e);
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
        validationSchema={Yup.object({
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
        })}
        onSubmit={async (values: { firstName: string; lastName: string; email: string; password: string; }) => onSubmit(values)}
      >
        {(formik: { handleSubmit: FormEventHandler<HTMLFormElement> | undefined; isSubmitting: any; }) => (
          <>
            <form onSubmit={formik.handleSubmit}>
              <div >
                <input
                  name="csrfToken"
                  type="hidden"
                  defaultValue={csrfToken}
                />
                <div className="text-red-400 text-md text-center rounded p-2">
                  {error}
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="uppercase text-sm text-gray-600 font-bold"
                  >
                        First Name
                    <Field
                      name="firstName"
                      aria-label="enter your first name"
                      aria-required="true"
                      type="text"
                      className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                    />
                  </label>
                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="firstName" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="uppercase text-sm text-gray-600 font-bold"
                  >
                        Last Name
                    <Field
                      name="lastName"
                      aria-label="enter your last name"
                      aria-required="true"
                      type="text"
                      className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                    />
                  </label>
                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="lastName" />
                  </div>
                </div>
                <div>
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
                <div>
                  <label
                    htmlFor="password"
                    className="uppercase text-sm text-gray-600 font-bold"
                  >
                        Password
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

                {role === "tutor" && (
                  <>
                    <label
                      htmlFor="subjects"
                      className="uppercase text-sm text-gray-600 font-bold"
                    >
                    Subjects
                      <SubjectSelect setFunction={setSubjects} subjects={subjects}/>
                    </label>
                    <div className="text-red-600 text-sm">
                      <ErrorMessage name="subjects" />
                    </div>

                    <label htmlFor="time" className="flex justify-center text-xs" >price for lesson</label>
                    <div className="input-group w-full">
                      <input
                        placeholder="min"
                        name="min"
                        id="time"
                        type="number"
                        required
                        className="w-1/2 mr-0"
                        onChange = {
                          (e: any) => {
                            try {
                              setMinutes(e.target.value);
                            } catch (e) {
                              alert("minutes must be a number");
                            }
                          }
                        }
                      />

                      <input
                        placeholder="eur"
                        name="eur"
                        type="number"
                        required
                        className="w-1/2 ml-0"
                        onChange = {
                          (e: any) => {
                            try {
                              setPrice(e.target.value);
                            } catch (e) {
                              alert("price must be a number");
                            }
                          }
                        }
                      />
                    </div>
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
                  <label htmlFor="terms" className="text-xs">Agree to our <Link href="/">Terms</Link></label>
                </div>

                <div className="flex justify-center p-3">
                  <input
                    type="checkbox"
                    id="newslettersCheck"
                    value="check"
                    className="checkbox-xs"
                    onChange={() => setSubscribed(!subscribed)}
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
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
