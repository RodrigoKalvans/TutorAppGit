import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Subject from "@/models/Subject";
import {getToken} from "next-auth/jwt";

/**
 * Subjects general route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getSubjects(req, res);
  // POST method
  if (req.method === "POST") await createSubject(req, res);

  await db.disconnect();
  return;
};

/**
 * GET all subject that match the query (filters)
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getSubjects = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundSubjects = await Subject.find(req.query);

  res.status(StatusCodes.OK).send(foundSubjects);
  return;
};

/**
 * POST request handler to create new subject (only allowed by admin)
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const createSubject = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});

  if (!token || token.role !== "admin") {
    res.status(StatusCodes.UNAUTHORIZED).send("You are not allowed to create subjects!");
    return;
  }

  const reqSubject = req.body;

  if (!reqSubject.name || !reqSubject.icon) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "Subject is missing a property!"});
    return;
  }

  try {
    const newSubject = new Subject(reqSubject);

    await newSubject.save();

    res.status(StatusCodes.OK).send({message: "New subject was created!", subject: newSubject});
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }

  return;
};

export default handler;
