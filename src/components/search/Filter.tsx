import * as Yup from "yup";

import { ErrorMessage, Field, Formik } from "formik";
import { FormEventHandler, useEffect, useState } from "react";

import SubjectSelect from "../SubjectSelect";

// TODO: figure out how to filter for subjects and languages

/**
 * TODO: fill this in
 * @param param0 
 * @returns 
 */
export default function Filter({storeQueryStateFunction, buttonAction, passedRole = "both", subjects}: {storeQueryStateFunction: any, buttonAction: any, passedRole?: string | undefined, subjects: any}) {

    const [role, setRole] = useState<string>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [rating, setRating] = useState<number>();
    const [chosenSubjects, setSubjects] = useState<any>();
    const [chosenLanguages, setLanguages] = useState<any>();

    // triggers only once
    useEffect(() => {
        if (passedRole) setRole(passedRole);
    }, [])

    const getArrayOfChosenSubjectIds = () => {
        const placeholder: string[] = [];
        if (chosenSubjects) {
            for (let i = 0; i < chosenSubjects.length; i++) {
                placeholder.push(chosenSubjects.at(i).value);
            }
        }
        console.log(placeholder)
        return placeholder;
    };

    const submit = () => {
        const query = {
            role: role,
            firstName: firstName,
            lastName: lastName,
            rating: rating,
            subjects: getArrayOfChosenSubjectIds(),
        };
        alert(`submit() in filter || ${query}`)
        storeQueryStateFunction(query);
        buttonAction();
        console.log("filter submitted", query);
    }

    return (
        <>
        <div className="w-full rounded-2xl shadow-2xl bg-white flex justify-center p-2">
            <div className="flex justify-center">
                <Formik
                initialValues={{
                    role: "",
                    firstName: "",
                    lastName: "",
                    rating: 0,
                }}
                validationSchema={Yup.object({
                    firstName: Yup
                        .string(),
                    lastName: Yup
                        .string(),
                    rating: Yup
                        .number(),
                    subjects: Yup  
                        .array(),
                    languages: Yup
                        .array(),
                })}
                onSubmit={() => {
                    console.log("onSubmit")
                    submit();
                }}>
                    {(formik: { handleSubmit: FormEventHandler<HTMLFormElement> | undefined; isSubmitting: any; }) => (
                        <form className="w-4/5 flex-col justify-center ">
                            <h2 className="uppercase w-full flex justify-center my-3 font-bold text-lg">filter</h2>
                            <label 
                                htmlFor="role"
                                className="uppercase text-sm flex-col text-gray-600 font-bold"
                            >
                                role
                                <select
                                    className="p-2 w-fit ml-3 rounded-xl bg-gray-300 mt-0  text-gray-900"
                                    name="role"
                                    defaultValue={"both"}
                                    onChange={(e: any) => setRole(e.target.value)}
                                >
                                    <option value="both">Both</option>
                                    <option value="tutors">Tutors</option>
                                    <option value="students">Students</option>
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
                                    type="text"
                                    className="w-full bg-gray-300 mt-0  text-gray-900 p-2 ml-0"
                                    onChange={(e: any) => setFirstName(e.target.value)}
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
                                    type="text"
                                    className="w-full bg-gray-300 mt-0  text-gray-900 p-2 ml-0"
                                    onChange={(e: any) => setLastName(e.target.value)}
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
                                    type="numeric"
                                    className="w-full bg-gray-300 mt-0 text-gray-900 p-2 ml-0"
                                    onChange={(e: any) => setRating(e.target.value)}
                                />
                            </label>
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
                            {/** TODO: add language filter */}
                            <br/>
                            <div className="w-full flex items-center justify-center mb-3">
                                <button
                                type="submit"
                                className="bg-orange-500 text-gray-100 p-3 rounded-lg w-full"
                                >
                                    {formik.isSubmitting ? "Please wait..." : "Sign Up"}
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
        </>
    )
}