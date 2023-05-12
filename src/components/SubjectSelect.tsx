import Select from "react-tailwindcss-select";
import {Dispatch, useEffect, useState} from "react";

/**
 * Subject select element
 * @param {Array<any>} subjects all
 * @param {Dispatch<any>} setSubjectsState for setting selected subjects
 * @param {Array<any>?} userSubjects in case values should be pre-loaded into selected subjects
 * @return {JSX} SubjectSelect
 */
export default function SubjectSelect({
  subjects,
  setSubjectsState,
  userSubjects,
} : {
  subjects: Array<any>,
  setSubjectsState: Dispatch<any>,
  userSubjects?: Array<any>
}) {
  const [chosenSubjects, setChosenSubjects] = useState<Array<any> | null>([]);

  /**
   * In case there need to be preloaded values
   */
  useEffect(() => {
    if (userSubjects && userSubjects.length > 0) {
      if (!chosenSubjects) setChosenSubjects([]);
      for (let i = 0; i < userSubjects.length; i++) {
        const option = {value: `${userSubjects[i]._id}`, label: `${userSubjects[i].name}`};
        chosenSubjects!.push(option);
      }
    }
    return () => {
      setChosenSubjects(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSubjects]);


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
    if (value) {
      setSubjectsState(value.map((option: {
        value: string,
        label: string,
        disabled: boolean
      }) => option.value));
    } else {
      setSubjectsState([]);
    }
    setChosenSubjects(value);
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
          placeholder="Subjects"
          classNames={{
            tagItemText: "text-sm m-1",
          }}
        />
      </div>
    </>
  );
}
