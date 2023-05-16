import Select from "react-tailwindcss-select";
import {Dispatch, useState} from "react";
import languages from "@/utils/languages.json";
import {ObjectId} from "mongoose";

/**
 * Language select element
 * @param {Dispatch<any>} setLanguagesState is state that is tracked by the parent component
 * @param {Array<any>?} userLanguages is an optional preset of languages
 * @return {JSX} LanguageSelect
 */
export default function LanguageSelect({
  setLanguagesState,
  userLanguages,
} : {
  setLanguagesState: Dispatch<any>,
  userLanguages?: {
    code: string,
    name: string,
    _id: ObjectId
  }[],
}) {
  // Create the state and populate it with languages of the user if exist.
  // Will make the user's languages display as chosen by default
  const [chosenLanguages, setChosenLanguages] = useState<Array<any> | null>(
    userLanguages ?
    userLanguages.map((languageObj: {code: string, name: string, _id: ObjectId}) => {
      return {value: languageObj.code, label: languageObj.name};
    }) : null,
  );

  /** turn subjects into parsable data by Select element
     * is called when subject Select element is initialized
     * @return {JSX} component
     */
  const getLanguageOptions = () => {
    const options: { value: string; label: string; }[] = [];
    languages.map((language: any) => options.push({value: `${language.code}`, label: `${language.name}`}));
    return options;
  };

  /** is called onChange in Select element
     * @param {string[]} value is the new string[] containing chosen options objects
     */
  const setSelectedLanguages = (value: any) => {
    if (value) {
      setLanguagesState(value.map((option: {
        value: string,
        label: string,
        disabled: boolean
      }) => {
        return {code: option.value, name: option.label};
      }));
    } else {
      setLanguagesState([]);
    }
    setChosenLanguages(value);
  };

  return (
    <>
      <div className="shadow-none">
        <Select
          onChange={setSelectedLanguages}
          options={getLanguageOptions()}
          primaryColor={""}
          isMultiple={true}
          isSearchable={true}
          value={chosenLanguages}
          placeholder="Languages"
          classNames={{
            tagItemText: "text-sm m-1",
          }}
        />
      </div>
    </>
  );
}
