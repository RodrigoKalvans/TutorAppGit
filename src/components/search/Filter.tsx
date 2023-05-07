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
      .string(),
  firstName: Yup
      .string(),
  lastName: Yup
      .string(),
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
  const [role, setRole] = useState<string>(router.query.role ? router.query.role.toString() : "tutor");
  const [chosenSubjects, setChosenSubjects] = useState<Array<any>>();
  const [chosenLanguages, setChosenLanguages] = useState<Array<any>>();

  const initValues = { // for the form
    role: role,
    firstName: "",
    lastName: "",
    rating: undefined,
  };

  const handleSubmit = (values: any) => {
    const query = {
      role: role,
      firstName: values.firstName,
      lastName: values.lastName,
      rating: values.rating,
      subjects: chosenSubjects,
      languages: chosenLanguages,
    };
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
      <div className="w-[16rem] md:w-[18rem] lg:w-[20rem] h-fit rounded-2xl shadow-xl bg-white p-2">
        <div className="flex justify-center">
          <Formik
            initialValues={initValues}
            validationSchema={schema}
            onSubmit={async (values: Values) => handleSubmit(values)}
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
                    defaultValue={"tutor"}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="tutor">Tutors</option>
                    <option value="student">Students</option>
                    <option value="both">Both</option>
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
                    className="btn hover:bg-orange-600 bg-orange-500 text-gray-100 p-3 rounded-lg w-full"
                  >
                    {formik.isSubmitting ? "Please wait..." : "Filter"}
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
