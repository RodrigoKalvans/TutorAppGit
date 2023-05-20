import Select from "react-tailwindcss-select";
import {Dispatch, useCallback, useState} from "react";

const MAXIMUM_SELECTED_SUBJECTS = 3;

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
  const [chosenSubjects, setChosenSubjects] = useState<Array<any> | null>(
    userSubjects ?
    userSubjects.map((s: {_id: string, name: string}) => {
      return {value: s._id, label: s.name};
    }) : null,
  );

  /** turn subjects into parsable data by Select element
     * is called when subject Select element is initialized
     * @return {JSX} component
     */
  const getSubjectOptions = useCallback(() => {
    const options: { value: string; label: string; }[] = [];
    subjects.map((subject: any) => options.push({value: `${subject._id}`, label: `${subject.name}`}));
    return options;
  }, [subjects]);

  /** is called onChange in subject Select element
     * @param {Array<string>} value is the new string[] containing chosen options objects
     */
  const setSelectedSubjects = useCallback((value: any) => {
    // make sure user does not add more subjects than is allowed
    if (chosenSubjects && chosenSubjects.length >= MAXIMUM_SELECTED_SUBJECTS && value.length > chosenSubjects.length) return;
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
  }, [chosenSubjects, setSubjectsState]);

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
