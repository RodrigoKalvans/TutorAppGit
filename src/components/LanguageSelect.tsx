import Select from "react-tailwindcss-select";
import {useState} from "react";

const langs: string[] = [
  "english",
  "latvian",
  "ukrainian",
];

/**
 * yo
 * @return {JSX} component
 */
export default function LanguageSelect({setFunction, languages = langs}: {setFunction: any, languages?: string[]}) {
  const [chosenLanguages, setChosenLanguages] = useState<any>();

  /** turn subjects into parsable data by Select element
     * is called when subject Select element is initialized
     * @return {JSX} component
     */
  const getLanguageOptions = () => {
    const options: { value: string; label: string; }[] = [];
    languages.map((subject: any) => options.push({value: `${subject}`, label: `${subject}`}));
    return options;
  };

  /** is called onChange in subject Select element
     * @param {string[]} value is the new string[] containing subject ids
     */
  const setSelectedLanguages = (value: any) => {
    setChosenLanguages(value);
    setFunction(value);
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
