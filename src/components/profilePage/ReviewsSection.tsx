import Review from "./helpingComponents/Review";
import BoxContainer from "./helpingComponents/BoxContainer";

const ReviewsSection = ({reviews}: {reviews: Array<any>}) => {
  return (
    <BoxContainer style="h-full mt-4 flex flex-col justify-around">
      <div className="pb-2 border-b-2">
        <h2 className="text-xl font-medium">Reviews</h2>
      </div>
      <div className="overflow-y-auto h-[75vh]">
        {reviews.map((review: any) =>
          <Review review={review} key={review._id}></Review>,
        )}
      </div>
    </BoxContainer>
  );
};

export default ReviewsSection;
