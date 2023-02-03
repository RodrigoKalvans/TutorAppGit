import Student from "../../../models/Student";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";

/**
 * Students route (general). Used  to get all or filtered students
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getStudents(req, res);

  await db.disconnect();
  return;
};

/**
 * GET students request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getStudents = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundStudents = await Student.find(req.query);

  res.status(StatusCodes.OK).send(foundStudents);
  return;
};

export default handler;
