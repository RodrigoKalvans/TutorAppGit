import {format} from "date-fns";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import { StarIcon } from "@/utils/icons";


const TrendingTutorReview = ({review, reviewer}: {review: any, reviewer: any}) => {
  return (
    <>
      <div className="bg-orange-310 rounded-3xl mr-2 p-1 flex flex-col text-black">
        <div className="flex h-14">
          <div className="w-14">
            <ProfilePicture user={reviewer} style="" />
          </div>
          <div className="flex flex-col">
            <b className="pl-3">{reviewer.firstName + " " + reviewer.lastName}</b>
            <b className="pl-3 capitalize text-subtitle text-sm">{reviewer.role}</b>
          </div>
        </div>
        <div className="flex justify-between px-5 py-1 text-xs">
          <div className="flex items-center gap-1"><StarIcon width={"20px"} fill="black" />{review.rating}</div>
          <div>{format(new Date(review.createdAt), "dd/MM/yyyy")}</div>
        </div>
        <p className="text-sm overflow-hidden h-20">
          {review.text}
        </p>
      </div>
    </>
  );
};

export default TrendingTutorReview;
