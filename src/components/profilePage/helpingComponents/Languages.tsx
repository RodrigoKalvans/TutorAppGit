const Languages = ({languages, size = "text-xl"}: {languages: Array<any>, size?: string}) => {
  return (
    <div>
      <h2 className={`${size} font-medium pb-2`}>Languages</h2>
      {languages ? languages.map((language: any) =>
        <div key={language.code} className="flex">
          <p className="text-base">{language.name}</p>
        </div>,
      ) : <div>Not found</div>}
    </div>
  );
};

export default Languages;
