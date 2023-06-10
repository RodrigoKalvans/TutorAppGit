import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import {getToken} from "next-auth/jwt";
import FeaturedTutors from "@/models/FeaturedTutor";

/**
 * Subjects general route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  if (req.method === "DELETE") await deleteFeaturedTutor(req, res);
  else res.status(StatusCodes.METHOD_NOT_ALLOWED).send({message: "Method not allowed"});

  // await db.disconnect();
  return;
};

const deleteFeaturedTutor = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.FORBIDDEN).send({message: "You are not authenticated"});
    return;
  } else if (token.id !== "admin") {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not authorized"});
    return;
  }

  try {
    const toDelete = await FeaturedTutors.findByIdAndDelete({
      id: req.query.id,
    });

    if (!toDelete) {
      res.status(StatusCodes.NOT_FOUND).send({message: "ID not found"});
    }
    res.status(StatusCodes.OK).send(toDelete);
  } catch (err) {
    res.status(StatusCodes.IM_A_TEAPOT).send(err);
  }
  return;
};

export default handler;
