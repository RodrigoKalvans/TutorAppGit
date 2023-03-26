import Review from "./helpingComponents/Review";
import BoxContainer from "./helpingComponents/BoxContainer";

const ReviewsSection = ({reviews}: {reviews: Array<any>}) => {
  return (
    <BoxContainer style="h-full mt-4 flex flex-col justify-around">
      <h2 className="text-xl font-medium">Reviews</h2>
      <div className="overflow-y-auto h-[75vh]">

        {reviews.map((review: any) =>
          <Review review={review} key={review}></Review>,
        )}
      </div>

    </BoxContainer>
  );
};

export default ReviewsSection;
