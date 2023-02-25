import * as Yup from "yup";

import { Field, Formik } from "formik";
import { FormEventHandler, useEffect, useState } from "react";
import { getSubjectOptions, setSelectedSubjects } from "@/utils/subjects";

import Select from "react-tailwindcss-select";

export default function Filter({storeState, buttonAction, passedRole = "both"}: {storeState: any, buttonAction: any, passedRole?: string | undefined}) {

    const [role, setRole] = useState<string>()

    // triggers only once
    useEffect(() => {
        if (passedRole) setRole(passedRole);
    }, [])

    const query: any = {}

    return (
        <>
        <div className="w-full rounded-2xl shadow-2xl bg-white">
            <div className="bord">
                <Formik
                initialValues={{
                    role: "",
                    firstName: "",
                    lastName: "",
                    rating: 0,
                    subject: "",
                    languages: [],
                }}
                validationSchema={Yup.object({
                    
                })}
                onSubmit={(values: {}) => {

                }}>
                    {(formik: { handleSubmit: FormEventHandler<HTMLFormElement> | undefined; isSubmitting: any; }) => (
                        <form className="">
                            <Field
                                name="firstName"
                                aria-label="First name"
                                type="text"
                                className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                            />
                            <Field
                                name="lastName"
                                aria-label="Last name"
                                type="text"
                                className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                            />
                            <Field
                                name="rating"
                                aria-label="Rating"
                                type="numeric"
                                className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                            />
                            <Field
                                name="subject"
                                aria-label="Subject"
                                type="text"
                                className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                            />
                            <Field
                                name="language"
                                aria-label="Language"
                                type="text"
                                className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                            />
                            
                        </form>
                    )}
                </Formik>
            </div>
        </div>
        </>
    )
}