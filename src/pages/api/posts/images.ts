import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest, NextApiHandler} from "next";
import {getToken} from "next-auth/jwt";

import {getPostPictures, uploadPostImages} from "@/utils/apiHelperFunction/pictureHelper";

/**
 * Post images route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // GET request
  if (req.method === "GET") await getImages(req, res);
  // POST method
  if (req.method === "POST") await uploadImages(req, res);

  return;
};

const getImages = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.keys) res.status(StatusCodes.BAD_REQUEST).send({error: "Missing required parameters (keys)."});

  await getPostPictures(res, req.query.keys as string[]);

  return;
};

const uploadImages = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Login or create an account first!",
        });
    return;
  }

  await uploadPostImages(req, res, token.id);

  return;
};

export default handler;
