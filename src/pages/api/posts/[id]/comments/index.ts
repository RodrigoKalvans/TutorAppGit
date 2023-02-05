import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Comment from "../../../../../models/Comment";
import {getToken} from "next-auth/jwt";
import Post from "@/models/Post";

/**
 * Comment route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  // GET request
  if (req.method === "GET") await getComments(req, res);
  // POST method
  if (req.method === "POST") await createComment(req, res);

  await db.disconnect();
  return;
};

/**
 * GET comments request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getComments = async (req: NextApiRequest, res: NextApiResponse) => {
  const foundComments = await Comment.findById(req.query);

  res.status(StatusCodes.OK).send(foundComments);
  return;
};

/**
 * POST create a new comment request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const createComment = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Log in first to leave comments!",
        });
    return;
  }

  const reqComment = req.body;
  reqComment.role = token.role;
  reqComment.userId = token.id;

  if ((reqComment.role !== "student" && reqComment.role !== "tutor") || !reqComment.postId ||
      !reqComment.text) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "Problem with provided information (Validation Error)"});
    return;
  }

  const newComment = new Comment(reqComment);

  const updatedPost = await Post.findByIdAndUpdate(reqComment.postId,
      {
        $push: {comments: {commentId: newComment._id}},
      });

  if (updatedPost) {
    await newComment.save();
    res.status(StatusCodes.CREATED).send({
      message: "Comment was successfully created!",
      comment: newComment,
    });
  } else {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({
      message: "Post does not exist!",
    });
  }

  return;
};


export default handler;
