import Review from "@/models/Review";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";
import {LandingPageCard, LandingPageCardReview} from "@/types/ambiguous-types";
import {FEATURED_TUTOR_IDS} from "./consts";

// TODO: Once our tutors have reviews, we can use this to dynamically select reviews
const NR_OF_REVIEWS = 2;

// TODO: Used while under development
// const PLACEHOLDER_REVIEW_IDS = [
//   "63e0e1d0b39271740d1ea873",
//   "63e0e420b39271740d1ea87f",
// ];

/**
 * Used in the landing page
 * @return {Array<any>} returns an array of usable objects
 */
export const getLandingPageTutors = async () => {
  const response: LandingPageCard[] = [];

  const tutors: Array<any> = await Tutor.find({
    _id: {
      $in: FEATURED_TUTOR_IDS,
    },
  });

  if (!tutors) return [];

  let reviewIds;

  for (let i = 0; i < tutors.length; ++i) {
    // if (tutors.at(i).reviews.length == 0) break;

    const block: LandingPageCard = {
      tutor: tutors.at(i),
      reviews: [],
    };

    // get reviews
    reviewIds = tutors.at(i).reviews.splice(0, NR_OF_REVIEWS); // this could be made to use preselected reviews

    const reviewsForCurrentTutor = await Review.find({ // review objects from the array of review IDs
      _id: {
        $in: reviewIds,
      },
    });
    console.log(reviewsForCurrentTutor, "what");

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
