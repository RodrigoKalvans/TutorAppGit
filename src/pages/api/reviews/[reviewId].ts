import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Review from "@/models/Review";
import {deleteReviewById} from "@/utils/apiHelperFunction/reviewHelper";

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

  // await db.disconnect();
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

export default handler;
