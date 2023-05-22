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

  // await db.disconnect();
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

  if (!token || token.role !== "tutor" && token.role !== "admin") {
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
      res.setHeader("Set-Cookie", "next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;");
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "The user you are logged in as cannot be found! Your account was either deleted or blocked. Please, update the page."});
      return;
    }

    const newSubjectIds = [];
    const subjectSubscriptionsToDelete = [];

    // Add subject ids to tutor. Prevent duplicates
    for (let i = 0; i < subjectIds.length; i++) {
      if (!tutor.subjects.includes(subjectIds[i])) {
        tutor.subjects.push(subjectIds[i]);
        newSubjectIds.push(subjectIds[i]);
      }
    }

    // Check what subscription need to be deleted
    for (let i = 0; i < tutor.subjects.length; i++) {
      if (!subjectIds.includes(tutor.subjects[i])) {
        tutor.subjects.splice(i, 1);
        subjectSubscriptionsToDelete.push(tutor.subjects[i]);
      }
    }

    await tutor.save();

    // Add the tutor to new subjects
    await Subject.updateMany({
      _id: {
        $in: newSubjectIds,
      },
    },
    {
      $addToSet: {
        tutors: token.id,
      },
    });

    // Delete tutor from unsubscribed subjects
    await Subject.updateMany({
      _id: {
        $in: subjectSubscriptionsToDelete,
      },
    },
    {
      $pull: {tutors: token.id},
    });

    res.status(StatusCodes.OK).send({message: "Successfully added!", tutor: tutor});
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
