import Tutor from "../../../models/Tutor";
import checkToken from "../../../utils/checkToken";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";

/**
 * Tutors route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getTutors(req, res);
  // PUT request
  if (req.method === "PUT") await updateTutor(req, res);
  // DELETE request
  if (req.method === "DELETE") await deleteTutor(req, res);

  await db.disconnect();
  return;
};

/**
 * GET tutors request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getTutors = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundTutors = await Tutor.find(req.query);

  res.status(StatusCodes.OK).send(foundTutors);
  return;
};

/**
 * PUT tutor request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const updateTutor = async (req: NextApiRequest, res: NextApiResponse) => {
  const check = await checkToken(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action!",
        });
    return;
  }

  console.log("Called. ID is ", req.query.id);
  try {
    const updatedTutors = await Tutor
        .findByIdAndUpdate(req.query.id,
            {
              $set: req.body,
            },
            {new: true},
        );

    res.status(StatusCodes.OK).send(updatedTutors);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

/**
 * DELETE tutor request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const deleteTutor = async (req: NextApiRequest, res: NextApiResponse) => {
  const check = await checkToken(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action!",
        });
    return;
  }

  try {
    const tutorToDelete = await Tutor.findByIdAndDelete(req.query.id);

    res.status(StatusCodes.OK).send({
      message: "User has been deleted",
      user: tutorToDelete,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  // Test if token gets deleted or if user can do some actions
  // after deleting their account
  // Possibly there is a way to sign out the user from the server side
  return;
};

export default handler;
