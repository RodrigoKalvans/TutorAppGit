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
  return <Image width={50} height={50} src={`/icons/subjectIcons/${subject.name.replace(/\s+/g, "").toLowerCase()}${orange ? "Orange" : ""}.svg`} alt={"icon"} className={style} />;
};

export default Icon;
