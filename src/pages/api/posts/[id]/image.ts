import {NextApiRequest, NextApiResponse} from "next";
import {StatusCodes} from "http-status-codes";
import {NextApiHandler} from "next/types";
import {getToken} from "next-auth/jwt";
import db from "@/utils/db";
import {getPostPicturesPresigned, uploadPostImages} from "@/utils/apiHelperFunction/pictureHelper";
import Post from "@/models/Post";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // POST request
  if (req.method === "POST") await postPicture(req, res);
  if (req.method === "GET") await getPostPicture(req, res);
  await db.disconnect();

  return;
};

const postPicture = async (req: NextApiRequest, res: NextApiResponse) => {
  const {id} = req.query;
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not authenticated! Log in or create an account first to upload images!"});
    return;
  }

  await uploadPostImages(req, res, id as string, token.id);

  return;
};

const getPostPicture = async (req: NextApiRequest, res: NextApiResponse) => {
  const {id} = req.query;
  const post = await Post.findById(id);

  if (!post) {
    res.status(StatusCodes.NOT_FOUND).send({message: "Post does not exist!"});
    return;
  } else if (!post.images || !Array.isArray(post.images)) {
    res.status(StatusCodes.NOT_FOUND).send({message: "Post does not have a pictures"});
    return;
  }

  await getPostPicturesPresigned(res, post.images);
  return;
};

export default handler;
