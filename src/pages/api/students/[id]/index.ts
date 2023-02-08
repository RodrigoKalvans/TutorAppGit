import Student from "../../../../models/Student";
import checkTokenForUsers from "../../../../utils/checkToken";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import {deleteAllReferencesOfDeletedUser} from "@/utils/apiHelperFunction/userHelper";

/**
 * Dynamic student route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const {id} = req.query;
  // GET request
  if (req.method === "GET") await getStudentById(res, id as String);
  // PUT request
  if (req.method === "PUT") await updateStudentById(req, res, id as String);
  // DELETE request
  if (req.method === "DELETE") await deleteStudentById(req, res, id as String);

  await db.disconnect();
  return;
};

/**
 * GET student by id request
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id student id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const getStudentById = async (res: NextApiResponse, id: String) => {
  const foundStudent = await Student.findById(id, {password: 0});

  res.status(StatusCodes.OK).send(foundStudent);
  return;
};

/**
 * PUT student by id request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id student id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const updateStudentById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const check = await checkTokenForUsers(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action!",
        });
    return;
  }

  try {
    const updatedStudent = await Student
        .findByIdAndUpdate(id,
            {
              $set: req.body,
            },
            {new: true},
        );

    res.status(StatusCodes.OK).send(updatedStudent);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

/**
 * DELETE student request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id student id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const deleteStudentById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const check = await checkTokenForUsers(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action!",
        });
    return;
  }

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    // TODO: DELETE POSTS AND ALL ACTIVITY OF THIS USER FROM DATABASE

    await deleteAllReferencesOfDeletedUser(deletedStudent);
    delete deletedStudent.password;

    // Delete token
    res.setHeader("Set-Cookie", "next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;");

    res.status(StatusCodes.OK).send({
      message: "User has been deleted",
      user: deletedStudent,
    });

    // Redirect user to main page
    res.redirect(307, "/");
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
