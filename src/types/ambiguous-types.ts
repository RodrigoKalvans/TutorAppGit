import Review from "@/models/Review";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";

export type LandingPageCardReview = {
  review: typeof Review | any,
  reviewer: typeof Tutor | typeof Student | any,
}

export type LandingPageCard = {
  tutor: typeof Tutor | any,
  reviews: LandingPageCardReview[],
}
