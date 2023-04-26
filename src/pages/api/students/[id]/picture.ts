import {NextApiRequest, NextApiResponse} from "next";
import {StatusCodes} from "http-status-codes";
import {NextApiHandler} from "next/types";
import {getToken} from "next-auth/jwt";
import db from "@/utils/db";
import {uploadProfilePicture, getProfilePicture, getProfilePicturePresigned} from "@/utils/apiHelperFunction/pictureHelper";
import Student from "@/models/Student";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  db.connect();
  // POST request
  if (req.method === "POST") await postProfilePicture(req, res);
  if (req.method === "GET") await getPicture(req, res);
  db.disconnect();

  return;
};

const postProfilePicture = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not authenticated! Log in or create an account first to upload any images!"});
    return;
  } else if (token.id !== req.query.id) {
    res.status(StatusCodes.FORBIDDEN).send({message: "The action is forbidden! You cannot upload images for other user!"});
    return;
  }

  await uploadProfilePicture(req, res, token.id, "student");

  return;
};

const getPicture = async (req: NextApiRequest, res: NextApiResponse) => {
  const student = await Student.findById(req.query.id);

  if (!student) {
    res.status(StatusCodes.NOT_FOUND).send({message: "Student does not exist!"});
    return;
  } else if (!student.picture) {
    res.status(StatusCodes.NOT_FOUND).send({message: "Student does not have a profile picture!"});
    return;
  }

  await getProfilePicturePresigned(res, student.picture);

  return;
};

export default handler;
