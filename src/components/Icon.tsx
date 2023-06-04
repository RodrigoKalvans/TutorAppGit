// import {MathIcon, HistoryIcon, BiologyIcon, EnglishIcon, ProgrammingIcon, GeographyIcon, ChemistryIcon, LiteratureIcon, PhysicsIcon, QuestionIcon} from "@/utils/icons";
import Image from "next/image";

/**
 * This can be used to display a subject's corresponding icon
 * @param {any} subject object
 * @param {string} style for design
 * @return {JSX}
 */
const Icon = ({
  subject,
  style,
  orange = false,
} : {
  subject: any,
  style: string,
  orange?: boolean,
}) => {
  return <Image width={50} height={50} src={`/icons/subjectIcons/${subject.name.toLowerCase()}${orange ? "Orange" : ""}.svg`} alt={"icon"} className={style} />;
  // TODO: rm this
  // switch (subject.name) {
  //   case "Math": return <MathIcon className={style} />;
  //   case "History": return <HistoryIcon className={style} />;
  //   case "Biology": return <BiologyIcon className={style} />;
  //   case "English": return <EnglishIcon className={style} />;
  //   case "Programming": return <ProgrammingIcon className={style} />;
  //   case "Geography": return <GeographyIcon className={style} />;
  //   case "Chemistry": return <ChemistryIcon className={style} />;
  //   case "Literature": return <LiteratureIcon className={style} />;
  //   case "Physics": return <PhysicsIcon className={style} />;
  //   default: return <QuestionIcon className={style} />;
  // }
};

export default Icon;
