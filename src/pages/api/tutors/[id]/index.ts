import Tutor from "../../../../models/Tutor";
import validateUser from "../../../../utils/checkToken";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import {deleteAllReferencesOfDeletedUser} from "@/utils/apiHelperFunction/userHelper";
import {getToken} from "next-auth/jwt";
import {MAX_LANGUAGE_COUNT} from "@/utils/consts";

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
  if (req.method === "GET") await getTutorById(res, id as string);
  // PUT request
  if (req.method === "PUT") await updateTutorById(req, res, id as string);
  // DELETE request
  if (req.method === "DELETE") await deleteTutorById(req, res, id as string);

  // await db.disconnect();
  return;
};

/**
 * GET tutor by id request
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id tutor id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const getTutorById = async (res: NextApiResponse, id: string) => {
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
  const check = await validateUser(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action!",
        });
    return;
  }

  const {body} = req;

  if (body.languages && body.languages.length > MAX_LANGUAGE_COUNT) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({
          message: "Maximum language count exceeded",
        });
    return;
  }

  if (body.password || body.role || body.subjects ||
    body.followers || body.following || body.rating ||
    body.reviews || body.activity || body.posts ||
    body.emailVerified || body.isSuspended ||
    body.subscriberId || body.donations) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "Password reset is not allowed with this request"});
    return;
  }

  try {
    const updatedTutors = await Tutor
        .findByIdAndUpdate(id, body, {new: true});

    res.status(StatusCodes.OK).send(updatedTutors);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send({message: "Error occurred", error});
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
  const token = await getToken({req});

  if (!token || token.id !== id && token.role !== "admin") {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action!",
        });
    return;
  }

  try {
    const deletedTutor = await Tutor.findByIdAndDelete(id);

    delete deletedTutor.password;

    // Delete all activity of this tutor from the database
    await deleteAllReferencesOfDeletedUser(deletedTutor);

    // Delete token
    res.setHeader("Set-Cookie", "next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;");
    res.status(StatusCodes.OK).send({
      message: "User has been deleted",
      user: deletedTutor,
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
