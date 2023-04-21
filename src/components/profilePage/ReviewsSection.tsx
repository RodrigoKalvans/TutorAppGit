import Review from "./helpingComponents/Review";
import BoxContainer from "./helpingComponents/BoxContainer";

const ReviewsSection = ({reviews}: {reviews: Array<any>}) => {
  return (
    <BoxContainer style="h-full flex flex-col justify-around">
      <div className="pb-2 border-b-2 text-xl font-medium">
        Reviews
      </div>
      <div className="overflow-y-auto max-h-[75vh]">
        {(reviews && reviews.length > 0) ?
          reviews.map((review: any) =>
            <Review review={review} key={review._id}></Review>,
          ) :
         (
          <p className="text-center mt-8 font-light text-base">This user does not have any reviews</p>
        )}

      </div>
    </BoxContainer>
  );
};

export default ReviewsSection;
