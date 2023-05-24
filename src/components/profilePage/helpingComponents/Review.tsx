import {SchoolIcon} from "@/utils/icons";
import ProfilePicture from "./ProfilePicture";
import RatingStar from "../../ratingStars/RatingStar";
import {format} from "date-fns";
import Link from "next/link";

const Review = ({review}: {review: any}) => {
  const reviewerUser = review.reviewerUser;
  return (
    <div className="w-full h-44 my-6 bg-container rounded-lg px-3 py-2">
      <div className="flex justify-between items-start">
        <div className="flex w-2/3 items-start">
          <div className="w-1/6 -translate-y-6">
            <Link href={`/${reviewerUser.role}s/${reviewerUser._id}`}>
              <ProfilePicture user={reviewerUser} />
            </Link>
          </div>
          <div>
            <Link href={`/${reviewerUser.role}s/${reviewerUser._id}`}>
              <p className="font-medium text-base m-0 ml-2">{reviewerUser.firstName} {reviewerUser.lastName}</p>
            </Link>
          </div>
        </div>

        <div className="flex items-center" >
          <p className="text-sm capitalize font-normal m-0 mr-2">{reviewerUser.role}</p>
          <SchoolIcon size={30} color="#282828" />
        </div>
      </div>

      <div className="px-5">
        {review.rating && (
          <div className="flex justify-between">
            <div className="w-1/5 flex items-center">
              <RatingStar colorStyle="text-orange-500" title="i" />
              <p className="text-xs font-light m-0">{review.rating}</p>
            </div>

            <div>
              <p className="text-xs font-light m-0">{format(new Date(review.createdAt), "dd/MM/yyyy")}</p>
            </div>

          </div>
        )}

        <div className="">
          <p className="text-base font-normal">{review.text}</p>
        </div>
      </div>


    </div>
  );
};

export default Review;
