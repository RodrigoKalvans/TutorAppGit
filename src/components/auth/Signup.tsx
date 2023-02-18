import * as Yup from 'yup';

import { ErrorMessage, Field, Formik } from 'formik';
import { FormEventHandler, useState } from 'react';

import Link from 'next/link';
import Select from "react-tailwindcss-select";
import { signIn } from 'next-auth/react';

export default function SignUp({ csrfToken, subjects }: {csrfToken: any, subjects: any}) {

    const [error, setError] = useState(null);

    // only for tutors
    const [minutes, setMinutes] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [chosenSubjects, setSubjects] = useState<string[]>();

    // change roll on button clicks
    const [role, setRole] = useState<string>("student");
    const setStudent = () => {
        setRole("student");
    }
    const setTutor = () => {
        setRole("tutor");
    }

    /** turn subjects into parsable data by Select element
     * is called when subject Select element is initialized
     */
    const getSubjectOptions = () => {
        const options: { value: string; label: string; }[] = [];
        subjects.map((subject: any) => options.push({ value: `${subject._id}`, label: `${subject.name}` }))
        return options;
    }

    /** is called onChange in subject Select element */
    const setSelectedSubjects = (value: any) => {
        setSubjects(value);
    }

    /** called when sending PUT request to update tutor subjects
     * condense subjects down to id[]
     */
    const getArrayOfChosenSubjectIds = () => {
        let placeholder: string[] = [];
        for (const i in chosenSubjects) {
            placeholder.push(i);
        }
        return placeholder;
    }

    return (
        <>
        <Formik
            initialValues={{ firstName: '', lastName: '', email: '', password: '', tenantKey: '' }}
            validationSchema={Yup.object({
            email: Yup.string()
                .max(30, 'Must be 30 characters or less')
                .email('Invalid email address')
                .required('Please enter your email'),
            password: Yup.string().required('Please enter your password'),
            firstName: Yup.string().required('Please enter your name'),
            lastName: Yup.string().required('Please enter your last name')
            })}
            onSubmit={async (values: { firstName: string; lastName: string; email: string; password: string;  }, { setSubmitting }: any) => {
                try {

                    // define object to be sent via HTTP
                    const user: {
                        firstName: string,
                        lastName: string,
                        email: string,
                        password: string,
                        role: string,
                        priceForLessons?: {}
                    } = {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        password: values.password,
                        role: role,
                    }
        
                    // changes entered prices to proper format
                    if (role === "tutor") {
                        const temp = new Map();
                        temp.set(minutes, price)
        
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
        
                    // is this type JSON?
                    const json: any = await res.json();

                    console.log(json)
        
                    // sign the user is and redirect
                    if (res.ok) {
                        const res = await signIn('credentials', {
                            email: values.email,
                            password: values.password,
                            callbackUrl: `/testAuth`,
                        });
                        if (res?.error) {
                            alert(res.error);
                        } else {
                            setError(null);
                        }
                    }
        
                    // if user is a tutor, send patch request to update subjects
                    if (role === "tutor") {
                        const res = await fetch("http://localhost:3000/api/subjects/subscribeTutorToSubjects", {
                            method: "PUT",
                            body: JSON.stringify({
                                subjects: getArrayOfChosenSubjectIds()
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })
                    }
                } catch (e) {
                    // TODO: redirect to error page
                    alert('An error has occured in try/catch');
                }

            }}
        >
            {(formik: { handleSubmit: FormEventHandler<HTMLFormElement> | undefined; isSubmitting: any; }) => (
                <>
                <div className="btn-group w-full">
                    <button onClick={setStudent} className="btn w-1/2 bg-orange-600 hover:bg-orange-500" >Student</button>
                    <button onClick={setTutor} className="btn w-1/2 bg-orange-600 hover:bg-orange-500">Tutor</button>
                </div>
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

                    {role === "student" ? (
                    <>
                    </>
                    ) : (
                    <>
                    <label
                        htmlFor="subjects"
                        className="uppercase text-sm text-gray-600 font-bold"
                    >
                        Subjects
                        <Select 
                        onChange={setSelectedSubjects}
                        options={getSubjectOptions()}
                        primaryColor={""}
                        isMultiple={true}
                        isSearchable={true} 
                        value={chosenSubjects} 
                        classNames={{
                            tagItemText: "text-sm m-1",
                        }}           
                        />
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
                                    setMinutes(e.target.value)
                                } catch (e) {
                                    alert("minutes must be a number")
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
                                    setPrice(e.target.value)
                                } catch (e) {
                                    alert("price must be a number")
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
                        id="check" 
                        value="check"
                        className="checkbox-xs" 
                        required
                        />

                        {/** TODO: link Terms to ToS */}
                        <label htmlFor="check" className="text-xs">Agree to our <Link href="/">Terms</Link></label>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="bg-orange-500 text-gray-100 p-3 rounded-lg w-full"
                        >
                            {formik.isSubmitting ? 'Please wait...' : 'Sign Up'}
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
