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
  if (req.method === "PUT") await addTutorToSubjects(req, res, id as String);

  await db.disconnect();
  return;
};

/**
 * PUT request to add a tutor to many subjects
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const addTutorToSubjects = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token || token.role !== "tutor") {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not logged in as a tutor! You cannot add yourself to the subject!"});
    return;
  }

  const subjectIds = req.body.subjectIds;

  if (!subjectIds) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "Not valid information!"});
    return;
  }

  try {
    // Additional security step - check if user still exists in db
    const tutor = await Tutor.findById(token.id);

    if (!tutor) {
      res.status(StatusCodes.NOT_FOUND).send({message: "Tutor does not exist!"});
      return;
    }

    // Update all subjects from the array with tutor id
    await Subject.updateMany({
      _id: {
        $in: subjectIds,
      },
    },
    {
      $addToSet: {
        tutors: token.id,
      },
    });

    // Add subject ids to tutor. Prevent duplicates
    for (let i = 0; i < subjectIds.length; i++) {
      if (!tutor.subjectsOfSpecialty.includes(subjectIds[i])) {
        tutor.subjectsOfSpecialty.push(subjectIds[i]);
      }
    }

    await tutor.save();

    res.status(StatusCodes.OK).send({message: "Successfully added!", tutor: tutor});
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
