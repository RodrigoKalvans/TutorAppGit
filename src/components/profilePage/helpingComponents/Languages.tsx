import Image from "next/image";
import Flag from "@/public/icons/gb.svg";

const Languages = ({languages}: {languages: Array<string>}) => {
  return (
    <div>
      <h2 className="text-xl font-medium pb-2">Languages</h2>
      {languages ? languages.map((language: string) =>
        <div className="flex">
          <Image width={20} height={20} src={Flag} alt="flag svg" />
          <p className="m-0 text-base pl-2">{language}</p>
        </div>,
      ) : <div>Not found</div>}
    </div>
  );
};

export default Languages;
