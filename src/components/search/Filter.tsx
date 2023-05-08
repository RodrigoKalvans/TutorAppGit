import * as Yup from "yup";

import {ErrorMessage, Field, Form, Formik} from "formik";
import {NextRouter, useRouter} from "next/router";

import LanguageSelect from "../LanguageSelect";
import SubjectSelect from "../SubjectSelect";
import {Dispatch, useEffect, useState} from "react";
import {isPromoted} from "@/utils/promotion";

type Values = {
  role: string,
  firstName: string | undefined,
  lastName: string | undefined,
  rating: number | undefined,
};

const schema = Yup.object({
  role: Yup
      .string()
      .max(8),
  firstName: Yup
      .string()
      .max(25),
  lastName: Yup
      .string()
      .max(25),
  location: Yup
      .string()
      .max(50),
  rating: Yup
      .number()
      .min(0)
      .max(5),
});

/**
 * Filter profiles on the search page
 * @param {Array<any>} subjects all
 * @param {Dispatch<any>} setProfileState state setter for displayed profiles
 * @param {Array<any>} allUsers used to filter
 * @return {JSX} filter component
 */
export default function Filter({
  subjects,
  setProfileState,
  allUsers,
} : {
  subjects: Array<any>,
  setProfileState: Dispatch<any>,
  allUsers: Array<any>
}) {
  const router: NextRouter = useRouter();
  const role = router.query.role ? router.query.role.toString() : "tutor";
  const [chosenSubjects, setChosenSubjects] = useState<Array<any>>();
  const [chosenLanguages, setChosenLanguages] = useState<Array<any>>();

  const initValues = { // for the form
    role: role,
    firstName: undefined,
    lastName: undefined,
    location: undefined,
    rating: undefined,
  };

  const handleSubmit = (values: any) => {
    const query = {
      ...values,
      subjects: chosenSubjects,
      languages: chosenLanguages,
    };
    console.log(query);
    setProfileState(filterProfiles(query, allUsers));
  };

  /**
 * This function is used to filter an array of profiles against a filter
 * -
 * @param {any} filter This will be used to filter items against
 * Any object is technically valid
 * profiles will be filtered to best fit the filter. If none the fields pass, array will not be c
 * If filter is empty, the array will be empty
 * Example of expected input:
 * {
 *  firstName: "John",
 *  lastName: "Doe",
 * }
 * This would result in profiles that include "John" in the firstName field and "Doe" in the lastName field (e.g. someone named "Johne Doey")
 * @param {Array<any>} sourceArray is the array that will be sorted - passed by reference
 * @return {Array<any>} filtered array
 */
  const filterProfiles = (filter: any | undefined, sourceArray: Array<any>) => {
    if (filter == undefined) filter = router.query; // in case we got here from the navbar
    const keys = Object.keys(filter); // keys in the filter (eg  { firstName: "john" } )
    const arr = sourceArray.filter((user: any) => { // do the following on every user object
      return keys.every((key: any) => {
        if (filter[key] == undefined || filter[key].length == 0) return true; // no value present in filter field
        if (Array.isArray(user[key])) return filter[key].every((val: any) => user[key].includes(val)); // every value in filter must be present in user
        if (key == "role" && filter[key] == "both") return true; // handle role == "both"
        if (key == "rating") return filter[key] == user[key].number; // rating is a number
        return user[key].toLowerCase().includes(filter[key].toLowerCase());
      });
    });
    return sortByDonation(arr);
  };

  /**
 * This is used to sort profiles based on whether the fit the donation criteria outlined by isPromoted()
 * @param {Array<any>} arr will be sorted by donations such that the early entries will be promoted, while the late entries won't
 * @return {Array<any>} sorted cope of the initial array
 */
  const sortByDonation = (arr: Array<any>) => {
    return arr.sort((a: any, b: any) => Number(isPromoted(b.donations)) - Number(isPromoted(a.donations)));
  };

  useEffect(() => {
    setProfileState(filterProfiles(router.query, allUsers));

    return () => {
      setProfileState(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]); // I don't understand this error

  return (
    <>
      <div className="h-fit rounded-2xl shadow-xl bg-white p-2">
        <Formik
          initialValues={initValues}
          validationSchema={schema}
          onSubmit={async (values: Values) => handleSubmit(values)}
        >
          {(formik: {
            isSubmitting: boolean | undefined;
          }) => (
            <Form className="px-5 flex flex-col gap-2">
              <h2 className="uppercase flex justify-center my-3 font-bold">filter</h2>

              <label
                htmlFor="role"
              >role
                <Field
                  as="select"
                  className="p-2 ml-2 rounded-xl bg-gray-300 text-black"
                  name="role"
                >
                  <option value="tutor" selected>Tutors</option>
                  <option value="student">Students</option>
                  <option value="both">Both</option>
                </Field>
              </label>

              <label
                htmlFor="firstName"
              >first name
                <Field
                  name="firstName"
                  type="text"
                  className="w-full bg-gray-300 text-gray-900"
                />
                <div className="text-xs text-red-600">
                  <ErrorMessage name="firstName" />
                </div>
              </label>

              <label
                htmlFor="lastName"
              >last name
                <Field
                  name="lastName"
                  type="text"
                  className="w-full bg-gray-300 text-gray-900"
                />
                <div className="text-xs text-red-600">
                  <ErrorMessage name="lastName" />
                </div>
              </label>

              <label
                htmlFor="rating"
              >rating
                <Field
                  name="rating"
                  type="numeric"
                  className="w-full bg-gray-300 text-gray-900"
                />
                <div className="text-xs text-red-600">
                  <ErrorMessage name="rating" />
                </div>
              </label>

              <label
                htmlFor="location"
              >location
                <Field
                  name="location"
                  type="text"
                  className="w-full bg-gray-300 text-gray-900"
                />
                <div className="text-xs text-red-600">
                  <ErrorMessage name="location" />
                </div>
              </label>

              <label
                htmlFor="subjects"
              >Subjects
                <SubjectSelect setFunction={setChosenSubjects} subjects={subjects} />
              </label>
              <div className="text-red-600 text-sm">
                <ErrorMessage name="subjects" />
              </div>

              <label
                htmlFor="languages"
              >Languages
                <LanguageSelect setFunction={setChosenLanguages} />
              </label>
              <div className="text-red-600 text-sm">
                <ErrorMessage name="languages" />
              </div>

              <button
                type="submit"
                className="btn hover:bg-orange-600 bg-orange-500 p-3 my-3 rounded-lg w-full"
              >
                {formik.isSubmitting ? "Please wait..." : "Filter"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
