import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest, NextApiHandler} from "next";
import db from "@/utils/db";
import Like from "@/models/Like";

/**
 * Likes route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getLikes(req, res);

  // await db.disconnect();
  return;
};

/**
 * GET comments per post request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getLikes = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundLikes = await Like.find(req.query);

  res.status(StatusCodes.OK).send(foundLikes);
  return;
};

export default handler;
