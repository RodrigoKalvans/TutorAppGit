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
  // PUT request
  if (req.method === "PUT") await addTutorToSubject(req, res, id as String);

  await db.disconnect();
  return;
};

/**
 * PUT request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const addTutorToSubject = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token || token.role !== "tutor") {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not a tutor! You cannot add yourself to the subject!"});
    return;
  }

  try {
    const subject = await Subject.findById(id);
    const tutor = await Tutor.findById(token.id);

    if (!subject || !tutor) {
      res.status(StatusCodes.NOT_FOUND).send({message: "Subject or tutor could not be found!"});
      return;
    }

    subject.tutors.push(token.id);
    tutor.subjectsOfSpecialty.push(id);

    await subject.save();
    await tutor.save();

    res.status(StatusCodes.OK).send({subject: subject, tutor: tutor});
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
