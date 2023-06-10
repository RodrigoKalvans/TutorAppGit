import Review from "@/models/Review";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";
import {LandingPageCard, LandingPageCardReview} from "@/types/ambiguous-types";
import {NR_OF_REVIEWS_PER_TOP_TUTOR_ON_LANDING_PAGE} from "./consts";
import FeaturedTutor from "@/models/FeaturedTutor";

/**
 * Used in the landing page to display top tutors
 * @return {Array<any>} returns an array of usable objects
 */
export const getLandingPageTutors = async () => {
  const featuredTutorIds = await FeaturedTutor.find();

  const ids: Array<string> = [];
  featuredTutorIds.forEach((obj: any) => ids.push(obj.tutorId));

  const tutors: Array<any> = await Tutor.find({
    _id: {
      $in: ids,
    },
  });

  const response: LandingPageCard[] = [];

  if (!tutors || tutors.length === 0) return [];

  // find the necessary data for each tutor (2 reviews + user for each review)
  for (let i = 0; i < tutors.length; ++i) {
    // if (tutors.at(i).reviews.length == 0) break;

    const block: LandingPageCard = {
      tutor: tutors.at(i),
      reviews: [],
    };

    // get reviews
    const reviewIds = tutors.at(i).reviews.splice(0, NR_OF_REVIEWS_PER_TOP_TUTOR_ON_LANDING_PAGE); // this could be made to use preselected reviews

    const reviewsForCurrentTutor = await Review.find({ // review objects from the array of review IDs
      _id: {
        $in: reviewIds,
      },
    });

    for (let j = 0; j < reviewsForCurrentTutor.length; ++j) {
      let reviewer: any; // user that made the review

      // find the user by id
      // TODO: handle different (admin?) role
      if (reviewsForCurrentTutor.at(j).reviewerUserRole == "student") {
        reviewer = await Student.findById(reviewsForCurrentTutor.at(j).reviewerUserId);
      } else if (reviewsForCurrentTutor.at(j).reviewerUserRole == "tutor") {
        reviewer = await Tutor.findById(reviewsForCurrentTutor.at(j).reviewerUserId);
      }

      const review: LandingPageCardReview = {
        reviewer,
        review: reviewsForCurrentTutor.at(j),
      };

      block.reviews.push(review);
    }

    response.push(block);
  }

  return response;
};
