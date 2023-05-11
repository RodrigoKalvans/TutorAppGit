import {MathIcon, HistoryIcon, BiologyIcon, EnglishIcon, ProgrammingIcon, GeographyIcon, ChemistryIcon, LiteratureIcon, PhysicsIcon, QuestionIcon} from "@/utils/icons";

/**
 * This can be used to display a subject's corresponding icon
 * @param {any} subject object
 * @param {string} style for design
 * @return {JSX}
 */
const Icon = ({
  subject,
  style,
} : {
  subject: any,
  style: string
}) => {
  const getIcon = () => {
    switch (subject.name) {
      case "Math": return <MathIcon className={style} />;
      case "History": return <HistoryIcon className={style} />;
      case "Biology": return <BiologyIcon className={style} />;
      case "English": return <EnglishIcon className={style} />;
      case "Programming": return <ProgrammingIcon className={style} />;
      case "Geography": return <GeographyIcon className={style} />;
      case "Chemistry": return <ChemistryIcon className={style} />;
      case "Literature": return <LiteratureIcon className={style} />;
      case "Physics": return <PhysicsIcon className={style} />;
      default: return <QuestionIcon className={style} />;
    }
  };
  return getIcon();
};

export default Icon;
