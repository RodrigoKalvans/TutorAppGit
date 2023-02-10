import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Subject from "@/models/Subject";
import {getToken} from "next-auth/jwt";
import Tutor from "@/models/Tutor";

/**
 * Dynamic subject route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const {id} = req.query;
  // GET request
  if (req.method === "GET") await getSubjectById(res, id as String);
  // PUT request
  if (req.method === "PUT") await updateSubjectById(req, res, id as String);
  // DELETE request
  if (req.method === "DELETE") await deleteSubjectById(req, res, id as String);

  await db.disconnect();
  return;
};

/**
 * GET review by id request
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const getSubjectById = async (res: NextApiResponse, id: String) => {
  const foundSubject = await Subject.findById(id);

  res.status(StatusCodes.OK).send(foundSubject);
  return;
};

/**
 * PUT request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const updateSubjectById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token || token.role !== "admin") {
    res.status(StatusCodes.FORBIDDEN).send({message: "You are not allowed to edit subjects!"});
    return;
  }

  const reqSubject = req.body;

  try {
    const updatedSubject = await Subject.findByIdAndUpdate(id, reqSubject);

    res.status(StatusCodes.OK).send(updatedSubject);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

/**
 * DELETE request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const deleteSubjectById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token || token.role !== "admin") {
    res.status(StatusCodes.FORBIDDEN).send({message: "You are not allowed to delete subjects!"});
    return;
  }

  try {
    const deletedSubject = await Subject.findByIdAndDelete(id);

    await Tutor.updateMany({
      _id: {
        $in: deletedSubject.tutors,
      },
    }, {
      $pull: {subjects: deletedSubject._id},
    });

    res.status(StatusCodes.OK).send({message: "Subject was successfully deleted!", subject: deletedSubject});
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }
};

export default handler;
