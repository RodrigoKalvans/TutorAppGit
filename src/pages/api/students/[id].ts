import Student from "../../../models/Student";
import checkToken from "../../../utils/checkToken";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";

/**
 * Students route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const {id} = req.query;
  // GET request
  if (req.method === "GET") await getStudent(req, res, id as String);
  // PUT request
  if (req.method === "PUT") await updateStudent(req, res, id as String);
  // DELETE request
  if (req.method === "DELETE") await deleteStudent(req, res, id as String);

  await db.disconnect();
  return;
};

/**
 * GET student by id request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id student id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const getStudent = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const foundStudent = await Student.findById(id);

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
const updateStudent = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const check = await checkToken(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action in!",
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
};

/**
 * DELETE student request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id student id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const deleteStudent = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const check = await checkToken(req);

  if (!check) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated/authorized to do this action in!",
        });
    return;
  }

  try {
    const studentToDelete = await Student.findByIdAndDelete(id);

    res.status(StatusCodes.OK).send({
      message: "User has been deleted",
      user: studentToDelete,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
