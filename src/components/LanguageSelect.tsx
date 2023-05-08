import Select from "react-tailwindcss-select";
import {Dispatch, useState} from "react";
import languages from "@/utils/languages.json";
import {ObjectId} from "mongoose";

/**
 * yo
 * @return {JSX} component
 */
export default function LanguageSelect({
  setFunction,
  userLanguages,
} : {
  setFunction: Dispatch<any>,
  userLanguages?: {
    code: string,
    name: string,
    _id: ObjectId
  }[]
}) {
  // Create the state and populate it with languages of the user if exist.
  // Will make the user's languages display as chosen by default
  const [chosenLanguages, setChosenLanguages] = useState<any>(userLanguages?.map(
      (languageObj: {code: string, name: string, _id: ObjectId}) => {
        return {value: languageObj.code, label: languageObj.name};
      },
  ));

  /** turn subjects into parsable data by Select element
     * is called when subject Select element is initialized
     * @return {JSX} component
     */
  const getLanguageOptions = () => {
    const options: { value: string; label: string; }[] = [];
    languages.map((language: any) => options.push({value: `${language.code}`, label: `${language.name}`}));
    return options;
  };

  /** is called onChange in subject Select element
     * @param {string[]} value is the new string[] containing chosen options objects
     */
  const setSelectedLanguages = (value: any) => {
    if (value.length <= 3) {
      setChosenLanguages(value);
      setFunction(value.map((option: {value: string, label: string, disabled: boolean}) => {
        return {code: option.value, name: option.label};
      }));
    }
  };

  return (
    <>
      <div>
        <Select
          onChange={setSelectedLanguages}
          options={getLanguageOptions()}
          primaryColor={""}
          isMultiple={true}
          isSearchable={true}
          value={chosenLanguages}
          classNames={{
            tagItemText: "text-sm m-1",
          }}
        />
      </div>
    </>
  );
}
