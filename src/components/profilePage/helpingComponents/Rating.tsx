import HalfRatingStar from "./ratingStars/HalfRatingStar";
import RatingStar from "./ratingStars/RatingStar";

const Rating = ({rating}: {rating: {number: number, ratingCount: number}}) => {
  const fullStars = Math.trunc(rating.number);
  const halfStar = Math.round(rating.number - fullStars);
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(fullStars)].map((o, i) =>
          <RatingStar key={i} colorStyle="text-orange-500" title="i" />,
        )}
        {halfStar === 1 && (
          <HalfRatingStar title={`${fullStars+1}`} />
        )}
        {[...Array(emptyStars)].map((o, i) =>
          <RatingStar key={i} colorStyle="text-gray-400" title="i" />,
        )}
      </div>
      <div>({rating.ratingCount})</div>

    </div>
  );
};

export default Rating;
