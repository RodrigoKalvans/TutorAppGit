import {NextApiRequest, NextApiResponse} from "next";
import {StatusCodes} from "http-status-codes";
import {NextApiHandler} from "next/types";
import {getToken} from "next-auth/jwt";
import Tutor from "@/models/Tutor";
import db from "@/utils/db";
import {uploadProfilePicture, getProfilePicturePresigned} from "@/utils/apiHelperFunction/pictureHelper";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Picture handler
* @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null
 */
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

  await uploadProfilePicture(req, res, token.id, "tutor");

  return;
};

const getPicture = async (req: NextApiRequest, res: NextApiResponse) => {
  const {id, key} = req.query;
  const tutor = await Tutor.findById(id);

  if (!tutor) {
    res.status(StatusCodes.NOT_FOUND).send({message: "Tutor does not exist!"});
    return;
  } else if (!tutor.picture) {
    res.status(StatusCodes.NOT_FOUND).send({message: "Tutor does not have a profile picture!"});
    return;
  }

  await getProfilePicturePresigned(res, key as string);

  return;
};

export default handler;
