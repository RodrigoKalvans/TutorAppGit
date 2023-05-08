import Review from "./helpingComponents/Review";
import BoxContainer from "./helpingComponents/BoxContainer";
import LeaveReviewButton from "./helpingComponents/LeaveReviewButton";
import {Session} from "next-auth";

const ReviewsSection = ({reviews, session, reviewedUserId, reviewedUserRole}: {reviews: Array<any>, session: Session | null, reviewedUserId: string, reviewedUserRole: string}) => {
  return (
    <BoxContainer style="h-full flex flex-col justify-around">
      <div className="flex border-b-2 justify-between items-center pb-2">
        <div className="text-xl font-medium">
          Reviews
        </div>
        {session && reviewedUserId !== session.user.id && (
          <LeaveReviewButton reviewedUserId={reviewedUserId} reviewedUserRole={reviewedUserRole} />
        )}
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
