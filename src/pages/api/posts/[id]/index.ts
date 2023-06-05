import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Post from "../../../../models/Post";
import {getToken} from "next-auth/jwt";
import Comment from "@/models/Comment";
import Tutor from "@/models/Tutor";
import Student from "@/models/Student";
import Like from "@/models/Like";
import {removeActivityFromUser} from "@/utils/apiHelperFunction/userHelper";

/**
 * Dynamic post route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const {id} = req.query;
  // GET request
  if (req.method === "GET") await getPostById(res, id as String);
  // PUT request
  if (req.method === "PUT") await updatePostById(req, res, id as String);
  // DELETE request
  if (req.method === "DELETE") await deletePostByID(req, res, id as String);

  // await db.disconnect();
  return;
};

/**
 * GET post by id request
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const getPostById = async (res: NextApiResponse, id: String) => {
  const foundStudent = await Post.findById(id);

  res.status(StatusCodes.OK).send(foundStudent);
  return;
};

/**
 * PUT post by id request
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const updatePostById = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Login or create an account first!",
        });
    return;
  }

  const updatingPost = await Post.findById(id);

  if (!updatingPost) {
    res.status(StatusCodes.NOT_FOUND).send({message: "The post to update was not found"});
    return;
  }

  if (updatingPost.userId !== token.id) {
    res.status(StatusCodes.FORBIDDEN)
        .send({
          message: "You are not authorized to do this action! It is not your post!",
        });
    return;
  }

  try {
    const updatedPost = await Post
        .findByIdAndUpdate(id,
            {
              $set: req.body,
            },
            {new: true},
        );

    res.status(StatusCodes.OK).send(updatedPost);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

/**
 * DELETE request
 * Deletes the post only if the user tries to delete their own post
 * Also all the comments are deleted from the database
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {String} id post id from dynamic page
 * @return {null} returns null in case the method of request is incorrect
 */
const deletePostByID = async (req: NextApiRequest, res: NextApiResponse, id: String) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Log in or create an account first!",
        });
    return;
  }

  const deletingPost = await Post.findById(id);

  if (!deletingPost) {
    res.status(StatusCodes.NOT_FOUND).send({message: "The post to delete was not found"});
    return;
  }

  if (deletingPost.userId !== token.id && token.role !== "admin") {
    res.status(StatusCodes.FORBIDDEN)
        .send({
          message: "You are not authorized to do this action! It is not your post!",
        });
    return;
  }

  try {
    const postToDelete = await Post.findByIdAndDelete(id);

    postToDelete.comments.forEach(async (element: {commentId: String;}) => {
      const deletedComment = await Comment.findByIdAndDelete(element.commentId);

      await removeActivityFromUser(deletedComment._id, undefined, deletedComment.userId, deletedComment.role);
    });

    // Remove post from the user
    if (postToDelete.role === "tutor") {
      await Tutor.findByIdAndUpdate(postToDelete.userId, {
        $pull: {posts: postToDelete._id},
      });
    } else {
      await Student.findByIdAndUpdate(postToDelete.userId, {
        $pull: {posts: postToDelete._id},
      });
    }

    // Remove likes from user's activity
    deletingPost.likes.forEach(async (element: {likeId: String;}) => {
      const deletedLike = await Like.findByIdAndDelete(element.likeId);

      await removeActivityFromUser(deletedLike._id, undefined, deletedLike.userId, deletedLike.role);
    });

    res.status(StatusCodes.OK).send({
      message: "Post has been deleted",
      post: postToDelete,
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send(error);
  }

  return;
};

export default handler;
