import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Comment from "@/models/Comment";
import {getToken} from "next-auth/jwt";
import Post from "@/models/Post";
import {removeActivityFromUser} from "@/utils/apiHelperFunction/userHelper";

/**
 * Dynamic comment route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const {commentId} = req.query;
  // GET request
  if (req.method === "GET") await getCommentById(res, commentId as String);
  // DELETE request
  if (req.method === "DELETE") await deleteCommentById(req, res, commentId as String);

  // await db.disconnect();
  return;
};

/**
 * GET comment by id request
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const getCommentById = async (res: NextApiResponse, id: String) => {
  const foundComment = await Comment.findById(id);

  res.status(StatusCodes.OK).send(foundComment);
  return;
};

/**
 * DELETE comment request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const deleteCommentById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token || token.id !== id && token.id !== "admin") {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authorized to do this action! It is not your comment!",
        });
    return;
  }

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);

    // Remove comment from the post
    await Post.findByIdAndUpdate(deletedComment.postId, {
      $pull: {comments: {commentId: deletedComment._id}},
    });

    await removeActivityFromUser(deletedComment._id, undefined, deletedComment.userId, deletedComment.role);
    res.status(StatusCodes.OK).send({
      message: "Comment has been deleted",
      comment: deletedComment,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
