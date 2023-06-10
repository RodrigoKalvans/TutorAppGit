import Review from "@/models/Review";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import {StatusCodes} from "http-status-codes";
import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";
import {removeActivityFromUser} from "./userHelper";


/**
 * GET request helper function to get reviews of a user
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id id of the reviewed student
 * @param {Object} query query object with other filtered properties
 * @return {null} returns null in case the method of request is incorrect
 */
export const getUserReviews = async (req: NextApiRequest, res: NextApiResponse, id: String, query: Object) => {
  const foundReviews = await Review.find({reviewedUserId: id, ...query});

  res.status(StatusCodes.OK).send(foundReviews);
  return;
};

/**
 * POST request helper function to create a new review
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} role role of the user
 * @param {String} reviewedUserId the id of a student that is being reviewed
 * @return {null} returns null in case the method of request is incorrect
 */
export const createReview = async (req: NextApiRequest, res: NextApiResponse, role: String, reviewedUserId: String) => {
  // Check if user is logged in
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Log in or create an account first to leave reviews!",
        });
    return;
  }

  // Update the review object from body with known information
  const reqReview = req.body;
  reqReview.reviewerUserRole = token.role;
  reqReview.reviewerUserId = token.id;
  reqReview.reviewedUserId = reviewedUserId;
  reqReview.reviewedUserRole = role;

  if ((reqReview.reviewerUserRole !== "student" && reqReview.reviewerUserRole !== "tutor") || !reqReview.reviewedUserId ||
      (!reqReview.text && !reqReview.rating) || (reqReview.reviewedUserRole !== "tutor" && reqReview.reviewedUserRole !== "student")) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "Problem with provided information (Validation Error)"});
    return;
  }

  const newReview = new Review(reqReview);

  try {
    const reviewedUser = (role === "tutor") ? await Tutor.findById(newReview.reviewedUserId) :
        await Student.findById(newReview.reviewedUserId);

    // Check if user left rating with review
    // If so, then update the rating by setting a new average
    if (reqReview.rating) {
      const newRatingCount = (reviewedUser.rating.ratingCount + 1);
      const newRatingNumber = ((reviewedUser.rating.number * reviewedUser.rating.ratingCount + parseFloat(reqReview.rating)) / newRatingCount);

      reviewedUser.rating.number = newRatingNumber;
      reviewedUser.rating.ratingCount = newRatingCount;
    }

    // Push the review to the reviews array
    reviewedUser.reviews.push(newReview._id);

    await reviewedUser.save();
    await newReview.save();

    await addReviewToUserActivity(newReview.reviewerUserRole, newReview._id, newReview.reviewerUserId);

    res.status(StatusCodes.CREATED).send({
      message: "Review was successfully created!",
      review: newReview,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send({
      message: `User with role ${role} and id ${newReview.reviewedUserId} does not exist!`,
      error: error,
    });
  }

  return;
};

const addReviewToUserActivity = async (role: String, reviewId: String, userId: String) => {
  if (role === "tutor") {
    await Tutor.findByIdAndUpdate(userId, {
      $push: {activity: {activityId: reviewId, activityType: "review"}},
    });
  } else if (role === "student") {
    await Student.findByIdAndUpdate(userId, {
      $push: {activity: {activityId: reviewId, activityType: "review"}},
    });
  }
};

/**
 * DELETE request helper function to delete review by id
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id review id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
export const deleteReviewById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Log in first!",
        });
    return;
  }

  const review = await Review.findById(id);

  if (!review) {
    res.status(StatusCodes.NOT_FOUND).send({message: `Review with id ${id} was not found`});
    return;
  } else if (review.reviewerUserId !== token.id) {
    res.status(StatusCodes.FORBIDDEN)
        .send({
          message: "You are not authorized to do this action! It is not your review!",
        });
    return;
  }

  try {
    const reviewToDelete = await Review.findByIdAndDelete(id);

    // Delete references from other models to the deleted review
    await removeActivityFromUser(reviewToDelete._id, undefined, reviewToDelete.reviewerUserId, reviewToDelete.reviewerUserRole);
    await deleteReviewFromReviewedUser(reviewToDelete);

    res.status(StatusCodes.OK).send({
      message: "Review and its references have been deleted",
      review: reviewToDelete,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send({error});
  }

  return;
};

export const deleteReviewFromReviewedUser = async (review: any) => {
  let reviewedUser;
  if (review.reviewedUserRole === "student") {
    reviewedUser = await Student.findByIdAndUpdate(review.reviewedUserId, {
      $pull: {reviews: review._id},
    },
    {safe: true},
    );
  } else if (review.reviewedUserRole === "tutor") {
    reviewedUser = await Tutor.findByIdAndUpdate(review.reviewedUserId, {
      $pull: {reviews: review._id},
    },
    {safe: true},
    );
  }

  const newRatingCount = (reviewedUser.rating.ratingCount - 1);
  const newRatingNumber = ((reviewedUser.rating.number * reviewedUser.rating.ratingCount - parseFloat(review.rating)) / newRatingCount);

  reviewedUser.rating.number = newRatingNumber;
  reviewedUser.rating.ratingCount = newRatingCount;

  await reviewedUser.save();
};
