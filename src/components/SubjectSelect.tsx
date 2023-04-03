import Select from "react-tailwindcss-select";
import {useState} from "react";

/**
 * TODO: 1. add user's subjects --
 * 2. populate the array for state with user's subjects --
 * 2.1 map through each element adn return the right object {value, label} --
 * 2.2 put it into state --
 * 3. change the backend api subscribe to completely override the subject
 * 3.1 delete the subjects that are not in the request and add the new once
 * @param {any} param0
 * @return {any} yo
 */
export default function SubjectSelect({setFunction, subjects, userSubjects}: {setFunction: any, subjects: any[], userSubjects?: any[]}) {
  const usedSubjects = [];

  if (userSubjects) {
    for (let i = 0; i < userSubjects.length; i++) {
      const option = {value: `${userSubjects[i]._id}`, label: `${userSubjects[i].name}`};
      usedSubjects.push(option);
    }
  }

  const [chosenSubjects, setChosenSubjects] = useState<any>(usedSubjects);

  /** turn subjects into parsable data by Select element
     * is called when subject Select element is initialized
     * @return {JSX} component
     */
  const getSubjectOptions = () => {
    const options: { value: string; label: string; }[] = [];
    subjects.map((subject: any) => options.push({value: `${subject._id}`, label: `${subject.name}`}));
    return options;
  };

  /** is called onChange in subject Select element
     * @param {string[]} value is the new string[] containing chosen options objects
     */
  const setSelectedSubjects = (value: any) => {
    setChosenSubjects(value);
    setFunction(value.map((option: {value: string, label: string, disabled: boolean}) => option.value));
  };

  return (
    <>
      <div className="shadow-none">
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
  );
}
