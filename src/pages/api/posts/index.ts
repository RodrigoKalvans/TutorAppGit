import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Post from "../../../models/Post";
import {getToken} from "next-auth/jwt";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";

/**
 * Posts route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getPosts(req, res);
  // POST method
  if (req.method === "POST") await createPost(req, res);

  // await db.disconnect();
  return;
};

/**
 * GET posts request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getPosts = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundStudent = await Post.find(req.query);

  res.status(StatusCodes.OK).send(foundStudent);
  return;
};

/**
 * POST create a new post request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Login or create an account first!",
        });
    return;
  }

  const reqPost = req.body;
  reqPost.role = token.role;
  reqPost.userId = token.id;

  if ((reqPost.role !== "student" && reqPost.role !== "tutor") ||
      (!reqPost.description && !reqPost.images)) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "Missing required parameters"});
    return;
  }

  try {
    const newPost = new Post(reqPost);

    await addPostToUserPosts(newPost.role, newPost._id.toString(), newPost.userId);
    await newPost.save();

    res.status(StatusCodes.CREATED).send({
      message: "Post was successfully created!",
      post: newPost,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send({error});
  }

  return;
};

const addPostToUserPosts = async (role: string, postId: string, userId: string) => {
  if (role === "tutor") {
    await Tutor.findByIdAndUpdate(userId, {
      $push: {posts: postId},
    });
  } else if (role === "student") {
    await Student.findByIdAndUpdate(userId, {
      $push: {posts: postId},
    });
  }
};

export default handler;
