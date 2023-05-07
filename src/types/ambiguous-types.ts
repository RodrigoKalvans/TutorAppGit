import Review from "@/models/Review";
import Tutor from "@/models/Tutor";

export type LandingPageCardReview = {
  review: typeof Review,
  reviewer: any,
}

export type LandingPageCard = {
  tutor: typeof Tutor,
  reviews: LandingPageCardReview[],
}
