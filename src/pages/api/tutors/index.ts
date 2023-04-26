import Tutor from "../../../models/Tutor";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";

/**
 * Tutors general route. Used to get all or filtered tutors
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getTutors(req, res);

  // await db.disconnect();
  return;
};

/**
 * GET tutors request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getTutors = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundTutors = await Tutor.find(req.query, {password: 0});

  res.status(StatusCodes.OK).send(foundTutors);
  return;
};

export default handler;
