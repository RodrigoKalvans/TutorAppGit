import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import {getToken} from "next-auth/jwt";
import FeaturedTutor from "@/models/FeaturedTutor";

/**
 * Subjects general route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  if (req.method === "GET") await getFeaturedTutors(res);
  else if (req.method === "POST") await postFeaturedTutor(req, res);
  else res.status(StatusCodes.METHOD_NOT_ALLOWED).send({message: "Method not allowed"});

  // await db.disconnect();
  return;
};

/**
 * GET all featured tutors
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null}
 */
const getFeaturedTutors = async (res: NextApiResponse) => {
  const tutors = await FeaturedTutor.find();
  res.status(StatusCodes.OK).send(tutors);
  return;
};

const postFeaturedTutor = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.FORBIDDEN).send({message: "You are not authenticated"});
    return;
  } else if (token.id !== "admin") {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not authorized"});
    return;
  } else if (!req.body.id) {
    res.status(StatusCodes.NO_CONTENT).send({message: "Missing id"});
    return;
  }

  try {
    const newFeaturedTutor = new FeaturedTutor(req.body);
    await newFeaturedTutor.save();
    res.status(StatusCodes.OK).send(newFeaturedTutor);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.BAD_REQUEST).send(err);
  }
  return;
};

export default handler;
