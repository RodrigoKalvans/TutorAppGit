import Tutor from "../../../../models/Tutor";
import checkTokenForUsers from "../../../../utils/checkToken";
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
  const {id} = req.query;
  // GET request
  if (req.method === "GET") await getTutorById(res, id as String);
  // PUT request
  if (req.method === "PUT") await updateTutorById(req, res, id as String);
  // DELETE request
  if (req.method === "DELETE") await deleteTutorById(req, res, id as String);

  await db.disconnect();
  return;
};

/**
 * GET tutor by id request
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id tutor id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const getTutorById = async (res: NextApiResponse, id: String) => {
  const foundTutors = await Tutor.findById(id, {password: 0});

  res.status(StatusCodes.OK).send(foundTutors);
  return;
};

/**
 * PUT tutor request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id tutor id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const updateTutorById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const check = await checkTokenForUsers(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action!",
        });
    return;
  }

  try {
    const updatedTutors = await Tutor
        .findByIdAndUpdate(id,
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
 * @param {String} id tutor id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const deleteTutorById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const check = await checkTokenForUsers(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action!",
        });
    return;
  }

  try {
    const tutorToDelete = await Tutor.findByIdAndDelete(id);
    // TODO: DELETE POSTS AND ALL ACTIVITY OF THIS USER FROM DATABASE

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
