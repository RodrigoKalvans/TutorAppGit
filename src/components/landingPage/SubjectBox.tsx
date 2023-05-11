import {BiologyIcon, ChemistryIcon, EnglishIcon, GeographyIcon, HistoryIcon, LiteratureIcon, MathIcon, PhysicsIcon, ProgrammingIcon, QuestionIcon} from "@/utils/icons";

/**
 * This component is used on the landing page to show available subjects on the platform
 * @param {any} subject
 * @return {JSX}
 */
export default function SubjectBox({subject}: {subject: any}) {
  console.log(subject.name);
  const iconStyle = "text-[60px] md:text-[80px] lg:text-[100px] h-full";
  const iconColor = "#F97316";
  const iconKey = subject._id;

  const getIcon = () => {
    switch (subject.name) {
      case "Math": {
        return <MathIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      case "History": {
        return <HistoryIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      case "Biology": {
        return <BiologyIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      case "English": {
        return <EnglishIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      case "Programming": {
        return <ProgrammingIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      case "Geography": {
        return <GeographyIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      case "Chemistry": {
        return <ChemistryIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      case "Literature": {
        return <LiteratureIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      case "Physics": {
        return <PhysicsIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
      default: {
        return <QuestionIcon className={iconStyle} color={iconColor} key={iconKey}/>;
      }
    }
  };

  return (
    <div className="rounded-2xl w-40 lg:w-80 p-4 py-6 flex flex-col lg:flex-row
      items-center hover:bg-gray-50 hov focus:bg-gray-50 last:hidden md:last:flex">
      <div className="lg:h-full lg:w-2/5">{getIcon()}</div>
      <div className="flex flex-col h-full lg:pl-5 pt-3 w-auto text-center lg:text-left">
        <div className="text-xl p-1">{subject.name}</div>
        <div className="text-sm p-1">{subject.tutors.length} tutors</div>
      </div>
    </div>
  );
}
