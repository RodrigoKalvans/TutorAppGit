import Tutor from "../../../models/Tutor";
import checkToken from "../../../utils/checkToken";
import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";

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

const getTutors = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundTutors = await Tutor.find(req.query);

  res.status(StatusCodes.OK).send(foundTutors);
  return;
};

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
