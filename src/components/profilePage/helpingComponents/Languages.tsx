const Languages = ({languages}: {languages: Array<any>}) => {
  return (
    <div>
      <h2 className="text-xl font-medium pb-2">Languages</h2>
      {languages ? languages.map((language: any) =>
        <div key={language.code} className="flex">
          <p className="m-0 text-base pl-2">{language.name}</p>
        </div>,
      ) : <div>Not found</div>}
    </div>
  );
};

export default Languages;
