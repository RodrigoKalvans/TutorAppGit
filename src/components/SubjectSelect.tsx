import Select from "react-tailwindcss-select";
import { useState } from "react";

// TODO: Make another one of this component but for languages

/**
 * TODO: fill this in
 * @param param0 
 * @returns 
 */
export default function SubjectSelect({setFunction, subjects}: {setFunction: any, subjects: any}) {

    const [chosenSubjects, setSubjects] = useState<any>();

    /** turn subjects into parsable data by Select element
     * is called when subject Select element is initialized
     * @return {{}[]} parsable options
     */
    const getSubjectOptions = () => {
        const options: { value: string; label: string; }[] = [];
        subjects.map((subject: any) => options.push({value: `${subject._id}`, label: `${subject.name}`}));
        return options;
    };

    /** is called onChange in subject Select element
     * @param {string[]} value is the new string[] containing subject ids
     */
    const setSelectedSubjects = (value: any) => {
        setSubjects(value);
        setFunction(value);
    };

    return (
        <>
        <div className="">
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
        </div>
        </>
    )
}
