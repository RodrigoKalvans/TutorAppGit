import Review from "@/models/Review";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";

export type LandingPageCardReview = {
  review: typeof Review,
  reviewer: typeof Tutor | typeof Student | any,
}

export type LandingPageCard = {
  tutor: typeof Tutor,
  reviews: LandingPageCardReview[],
}
