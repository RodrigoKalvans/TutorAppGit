const Languages = ({languages, size = "text-xl"}: {languages: Array<any>, size?: string}) => {
  return (
    <div>
      <h2 className={`${size} font-medium pb-2`}>Languages</h2>
      {languages && languages.map((language: any) =>
        <div className="flex">
          <p className="m-0 text-base pl-2">{language.name}</p>
        </div>,
      )}
    </div>
  );
};

export default Languages;
