import * as Yup from "yup";

import {ErrorMessage, Field, Form, Formik} from "formik";
import {NextRouter, useRouter} from "next/router";

import LanguageSelect from "../LanguageSelect";
import SubjectSelect from "../SubjectSelect";
import {Dispatch, useCallback, useEffect, useState} from "react";
import {isPromoted} from "@/utils/promotion";

type Values = {
  role: string,
  firstName: string | undefined,
  lastName: string | undefined,
  location: string | undefined,
  rating: number | undefined,
  price: number | undefined,
};

const schema = Yup.object({
  role: Yup
      .string()
      .max(8),
  firstName: Yup
      .string()
      .max(25, "First name cannot be longer than 25 chars"),
  lastName: Yup
      .string()
      .max(25, "Last name cannot be longer than 25 chars"),
  location: Yup
      .string()
      .max(50, "Location cannot be longer than 50 chars"),
  rating: Yup
      .number()
      .moreThan(0, "Rating cannot be <0")
      .lessThan(5, "Rating cannot be >5")
      .positive("Rating cannot be negative"),
  price: Yup
      .number()
      .positive("Price cannot be negative")
      .typeError("Price must be a number"),
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
  const [chosenSubjects, setChosenSubjects] = useState<Array<string>>();
  const [chosenLanguages, setChosenLanguages] = useState<Array<any>>();

  const initValues = { // for the form
    role: role,
    firstName: undefined,
    lastName: undefined,
    location: undefined,
    rating: undefined,
    price: undefined,
  };

  const handleSubmit = (values: any) => {
    const query = {
      ...values,
      subjects: chosenSubjects,
      languages: chosenLanguages,
    };
    setProfileState(filterProfiles(query));
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
  const filterProfiles = useCallback((filter: any | undefined) => {
    if (filter == undefined) filter = router.query; // in case we got here from the navbar
    const keys = Object.keys(filter); // keys in the filter (eg  { firstName: "john" } )
    const arr = allUsers.filter((user: any) => { // do the following on every user object
      return keys.every((key: any) => {
        try {
          if (filter[key] == undefined || filter[key] == null || filter[key].length == 0) return true; // no value present in filter field
          if (key == "rating") return filter[key] == user[key].number; // rating is a number
          if (key == "languages") return filter[key].every((filterLanguage: any) => user[key].some((userLanguage: any) => filterLanguage.name == userLanguage.name));
          if (key == "price") return Object.values(user["priceForLessons"]).some((price: any) => Number(price) <= Number(filter[key])); // any price in the user object must be below entered value
          if (key == "role" && filter[key] == "both" && user[key] !== "admin") return true; // handle role == "both"
          if (Array.isArray(user[key])) return filter[key].every((val: any) => user[key].includes(val)); // every value in filter must be present in user
          return user[key].toLowerCase().includes(filter[key].toLowerCase());
        } catch (err: any) {
          return false;
        }
      });
    });
    // sort before returning
    return sortByDonation(arr);
  }, [allUsers, router.query]);

  /**
 * This is used to sort profiles based on whether the fit the donation criteria outlined by isPromoted()
 * @param {Array<any>} arr will be sorted by donations such that the early entries will be promoted, while the late entries won't
 * @return {Array<any>} sorted cope of the initial array
 */
  const sortByDonation = (arr: Array<any>) => {
    return arr.sort((a: any, b: any) => Number(isPromoted(b.donations)) - Number(isPromoted(a.donations)));
  };

  useEffect(() => {
    const query = router.query;
    // This is done such that you can search by subject through router
    if (router.query.subjects && !Array.isArray(router.query.subjects)) {
      query.subjects = router.query.subjects.split("~");
    }
    setProfileState(filterProfiles(query));

    return () => {
      setProfileState(null);
    };
  }, [filterProfiles, router.query, setProfileState]);

  return (
    <>
      <div className="h-fit rounded-t-2xl bg-white p-2">
        <Formik
          initialValues={initValues}
          validationSchema={schema}
          onSubmit={async (values: Values) => handleSubmit(values)}
        >
          {(formik: {
            isSubmitting: boolean | undefined;
          }) => (
            <Form className="px-5 flex flex-col gap-1">
              <h2 className="flex justify-center mb-2 md:my-3 font-medium md:font-bold">Filter</h2>

              <label
                htmlFor="role"
              >Role
                <Field
                  as="select"
                  className="p-2 px-4 ml-2 rounded-xl bg-gray-300 text-black"
                  name="role"
                >
                  <option value="tutor">Tutors</option>
                  <option value="student">Students</option>
                  <option value="both">Both</option>
                </Field>
              </label>

              <Field
                name="firstName"
                as="input"
                placeholder="First name"
                className="w-full bg-gray-300 text-gray-900"
              />
              <div className="text-xs text-red-600">
                <ErrorMessage name="firstName" />
              </div>

              <Field
                name="lastName"
                as="input"
                placeholder="Last name"
                className="w-full bg-gray-300 text-gray-900"
              />
              <div className="text-xs text-red-600">
                <ErrorMessage name="lastName" />
              </div>

              <Field
                name="location"
                as="input"
                placeholder="Location"
                className="w-full bg-gray-300 text-gray-900"
              />
              <div className="text-xs text-red-600">
                <ErrorMessage name="location" />
              </div>

              <Field
                name="rating"
                as="input"
                type="number"
                placeholder="Rating"
                className="w-full bg-gray-300 text-gray-900"
              />
              <div className="text-xs text-red-600">
                <ErrorMessage name="rating" />
              </div>

              <Field
                name="price"
                as="input"
                type="number"
                placeholder="Maximum price"
                className="w-full bg-gray-300 text-gray-900"
              />
              <div className="text-xs text-red-600">
                <ErrorMessage name="price" />
              </div>

              <SubjectSelect setSubjectsState={setChosenSubjects} subjects={subjects} />
              <div className="text-sm text-red-600">
                <ErrorMessage name="subjects" />
              </div>

              <LanguageSelect setLanguagesState={setChosenLanguages} />
              <div className="text-sm text-red-600">
                <ErrorMessage name="languages" />
              </div>

              <button
                type="submit"
                className="submitButton my-2"
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
