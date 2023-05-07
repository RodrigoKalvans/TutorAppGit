import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Review from "../../../models/Review";
import {getToken} from "next-auth/jwt";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";

const NECESSARY_REVIEW_KEYS = [
  "reviewerUserRole",
  "reviewerUserId",
  "reviewedUserRole",
  "reviewedUserId",
  "text",
  "rating",
];

/**
 * Review general route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getReviews(req, res);
  // POST method
  if (req.method === "POST") await postReview(req, res);

  // await db.disconnect();
  return;
};

/**
 * GET all reviews that match the query (filters)
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getReviews = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundReviews = await Review.find(req.query);

  res.status(StatusCodes.OK).send(foundReviews);
  return;
};

/**
 * POST a new review
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const postReview = async (req: NextApiRequest, res: NextApiResponse) => {
  // token check
  const token = await getToken({req});
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Login or create an account first!",
        });
    return;
  }

  const reqReview = req.body;

  // make sure every necessary key is present
  if (!NECESSARY_REVIEW_KEYS.every((key: string) => Object.keys(reqReview).includes(key))) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
      message: "Invalid object keys",
    });
    return;
  }

  // TODO: Does this even matter??
  if (
    (reqReview.reviewerUserRole !== "student" && reqReview.reviewerUserRole !== "tutor") ||
    (reqReview.reviewedUserRole !== "student" && reqReview.reviewedUserRole !== "tutor")
  ) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
      message: "Invalid role",
    });
    return;
  }

  try {
    const newReview = new Review(reqReview);

    await addReviewToUser(newReview._id, newReview.reviewedUserId, newReview.reviewedUserRole);
    await newReview.save();

    res.status(StatusCodes.CREATED).send({
      message: "Review was successfully created",
      review: newReview,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send({message: error});
  }

  return;
};

const addReviewToUser = async (reviewId: string, userId: string, userRole: String) => {
  switch (userRole) {
    case "student": {
      await Student.findByIdAndUpdate(userId, {
        $push: {reviews: reviewId},
      });
      break;
    }
    case "tutor": {
      await Tutor.findByIdAndUpdate(userId, {
        $push: {reviews: reviewId},
      });
      break;
    }
    default: {
      // handle admin
      break;
    }
  }
};

export default handler;
