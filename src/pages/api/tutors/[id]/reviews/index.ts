import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import {createReview, getUserReviews} from "@/utils/apiHelperFunction/reviewHelper";

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
  if (req.method === "GET") await getUserReviews(req, res, id as String, query);
  // POST method
  if (req.method === "POST") await createReview(req, res, "tutor", id as String);

  // await db.disconnect();
  return;
};

export default handler;
