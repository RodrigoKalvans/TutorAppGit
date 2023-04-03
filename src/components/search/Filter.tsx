import * as Yup from "yup";

import {ErrorMessage, Field, Form, Formik} from "formik";
import {NextRouter, useRouter} from "next/router";

import LanguageSelect from "../LanguageSelect";
import SubjectSelect from "../SubjectSelect";
import {useState} from "react";

// TODO: figure out how to filter for subjects and languages

type Values = {
  role: string,
  firstName: string | undefined,
  lastName: string | undefined,
  rating: number | undefined,
};

/**
 * TODO: fill this in
 * @param {any} param0
 * @return {any} yo
 */
export default function Filter({subjects, action}: {subjects: any, action: any}) {
  const router: NextRouter = useRouter();

  const [chosenSubjects, setChosenSubjects] = useState<any>();
  const [chosenLanguages, setChosenLanguages] = useState<any>();

  // TODO: types
  const [role, setRole] = useState<any>(router.query.role ? router.query.role : "tutor");

  const initValues = { // for the form
    role: role,
    firstName: "",
    lastName: "",
    rating: undefined,
  };

  const getArrayOfChosenSubjectIds = () => {
    const placeholder: string[] = [];
    if (chosenSubjects) {
      for (let i = 0; i < chosenSubjects.length; i++) {
        placeholder.push(chosenSubjects.at(i).value);
      }
    }
    if (placeholder.length === 0) return undefined;
    return placeholder;
  };

  const handleSubmit = (values: any) => {
    const query = {
      role: role,
      firstName: values.firstName,
      lastName: values.lastName,
      rating: values.rating,
      subjects: getArrayOfChosenSubjectIds(),
      languages: chosenLanguages,
    };
    action(query);
  };

  return (
    <>
      <div className="w-full rounded-2xl shadow-xl bg-white flex justify-center p-2">
        <div className="flex justify-center">
          <Formik
            initialValues={initValues}
            validationSchema={Yup.object({
              role: Yup
                  .string(),
              firstName: Yup
                  .string(),
              lastName: Yup
                  .string(),
              rating: Yup
                  .number(),
            })}
            onSubmit={async (values: Values) => {
              handleSubmit(values);
            }}
          >
            {(formik: {
              isSubmitting: boolean | undefined;
            }) => (
              <Form className="w-4/5 flex-col justify-center ">
                <h2 className="uppercase w-full flex justify-center my-3 font-bold text-lg">filter</h2>
                <label
                  htmlFor="role"
                  className="uppercase text-sm flex-col text-gray-600 font-bold"
                >
                                role
                  <select
                    className="p-2 w-fit ml-3 rounded-xl bg-gray-300 mt-0  text-gray-900"
                    name="role"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="both">Both</option>
                    <option value="tutor" selected>Tutors</option>
                    <option value="student">Students</option>
                  </select>
                  <br/>
                </label>
                <label
                  htmlFor="firstName"
                  className="uppercase text-sm flex-col text-gray-600 font-bold"
                >
                                first name
                  <Field
                    name="firstName"
                    aria-label="First name"
                    aria-required="false"
                    type="text"
                    className="w-full bg-gray-300 mt-0 text-gray-900 p-2 ml-0"
                  />
                </label>
                <label
                  htmlFor="lastName"
                  className="uppercase text-sm text-gray-600 font-bold"
                >
                                last name
                  <Field
                    name="lastName"
                    aria-label="Last name"
                    aria-required="false"
                    type="text"
                    className="w-full bg-gray-300 mt-0  text-gray-900 p-2 ml-0"
                  />
                </label>
                <label
                  htmlFor="rating"
                  className="uppercase text-sm text-gray-600 font-bold"
                >
                                rating
                  <Field
                    name="rating"
                    aria-label="Rating"
                    aria-required="false"
                    type="numeric"
                    className="w-full bg-gray-300 mt-0 text-gray-900 p-2 ml-0"
                  />
                </label>
                <label
                  htmlFor="subjects"
                  className="uppercase text-sm text-gray-600 font-bold"
                >
                                Subjects
                  <SubjectSelect setFunction={setChosenSubjects} subjects={subjects}/>
                </label>
                <div className="text-red-600 text-sm">
                  <ErrorMessage name="subjects" />
                </div>
                <label
                  htmlFor="languages"
                  className="uppercase text-sm text-gray-600 font-bold"
                >
                                Languages
                  <LanguageSelect setFunction={setChosenLanguages} />
                </label>
                <div className="text-red-600 text-sm">
                  <ErrorMessage name="languages" />
                </div>
                <br/>
                <div className="w-full flex items-center justify-center mb-3">
                  <button
                    type="submit"
                    className="bg-orange-500 text-gray-100 p-3 rounded-lg w-full"
                  >
                    {formik.isSubmitting ? "Please wait..." : "Search"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
