import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Review from "../../../../../models/Review";
import {getToken} from "next-auth/jwt";

/**
 * Dynamic review route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const {reviewId} = req.query;
  // GET request
  if (req.method === "GET") await getReviewById(res, reviewId as String);
  // DELETE request
  if (req.method === "DELETE") await deleteReviewById(req, res, reviewId as String);

  await db.disconnect();
  return;
};

/**
 * GET review by id request
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const getReviewById = async (res: NextApiResponse, id: String) => {
  const foundReview = await Review.findById(id);

  res.status(StatusCodes.OK).send(foundReview);
  return;
};

/**
 * DELETE review request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const deleteReviewById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated!",
        });
    return;
  }

  const deletingReview = await Review.findById(id);

  if (deletingReview.reviewerUserId !== token.id) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authorized to do this action! It is not your review!",
        });
    return;
  }

  try {
    const reviewToDelete = await Review.findByIdAndDelete(id);

    res.status(StatusCodes.OK).send({
      message: "Review has been deleted",
      review: reviewToDelete,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
