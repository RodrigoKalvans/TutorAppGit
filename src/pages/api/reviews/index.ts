import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Review from "../../../models/Review";

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

export default handler;
