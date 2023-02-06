import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import {getToken} from "next-auth/jwt";
import Review from "../../../../../models/Review";
import Student from "../../../../../models/Student";
import Tutor from "../../../../../models/Tutor";

/**
 * Review route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {id, ...query} = req.query;
  await db.connect();
  // GET request
  if (req.method === "GET") await getReviews(req, res, id as String, query);
  // POST method
  if (req.method === "POST") await createReview(req, res, id as String);

  await db.disconnect();
  return;
};

/**
 * GET reviews per student request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id id of the reviewed student
 * @param {Object} query query object with other filtered properties
 * @return {null} returns null in case the method of request is incorrect
 */
const getReviews = async (req: NextApiRequest, res: NextApiResponse, id: String, query: Object) => {
  const foundReviews = await Review.find({reviewedUserId: id, ...query});

  res.status(StatusCodes.OK).send(foundReviews);
  return;
};

/**
 * POST create a new review request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} reviewedStudentId the id of a student that is being reviewed
 * @return {null} returns null in case the method of request is incorrect
 */
const createReview = async (req: NextApiRequest, res: NextApiResponse, reviewedStudentId: String) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Log in first to leave reviews!",
        });
    return;
  }

  const reqReview = req.body;
  reqReview.reviewerUserRole = token.role;
  reqReview.reviewerUserId = token.id;
  reqReview.reviewedUserId = reviewedStudentId;
  reqReview.reviewedUserRole = "student";

  if ((reqReview.reviewerUserRole !== "student" && reqReview.reviewerUserRole !== "tutor") || !reqReview.reviewedUserId ||
      (!reqReview.text && !reqReview.rating)) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "Problem with provided information (Validation Error)"});
    return;
  }

  const newReview = new Review(reqReview);

  try {
    const studentToBeReviewed = await Student.findById(newReview.reviewedUserId);

    // Check if user left rating with review
    // If so, then update the rating by setting a new average
    if (reqReview.rating) {
      const newRatingCount = (studentToBeReviewed.rating.ratingCount + 1);
      const newRatingNumber = ((studentToBeReviewed.rating.number + parseFloat(reqReview.rating)) / newRatingCount);

      studentToBeReviewed.rating.number = newRatingNumber;
      studentToBeReviewed.rating.ratingCount = newRatingCount;
    }

    // Push the review to the reviews list
    studentToBeReviewed.reviews.push({reviewId: newReview._id});

    await studentToBeReviewed.save();
    await newReview.save();
    await addReviewToUserActivity(newReview.reviewerUserRole, newReview._id, newReview.reviewerUserId);
    res.status(StatusCodes.CREATED).send({
      message: "Review was successfully created!",
      review: newReview,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send({
      message: "Student does not exist!",
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


export default handler;
