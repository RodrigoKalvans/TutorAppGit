const Price = ({priceForLessons}: {priceForLessons: {[key: string]: string}}) => {
  return (
    <div>
      <h2 className="text-xl font-medium pb-2">Price</h2>
      <div className="overflow-x-auto">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Time</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(priceForLessons).map((key: string) => (
              <tr key={key}>
                <td>{key} min</td>
                <td>&euro;{priceForLessons[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Price;
