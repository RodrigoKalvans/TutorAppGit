import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Like from "../../../../../models/Like";
import {getToken} from "next-auth/jwt";
import Post from "../../../../../models/Post";
import {addActivityToUser, removeActivityFromUser} from "@/utils/apiHelperFunction/userHelper";

/**
 * Comment route
 * @param {NextApiRequest} req HTTP request received from client side
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const {id} = req.query;

  const post = await Post.findById(id);

  if (!post) {
    res.status(StatusCodes.NOT_FOUND).send({message: "Post has not been found!"});
    return;
  }
  // GET request
  if (req.method === "GET") await getLikes(req, res);
  // POST method
  if (req.method === "POST") await like(req, res, id as string, post);
  // DELETE method
  if (req.method === "DELETE") await removeLike(req, res, id as string, post);

  // await db.disconnect();
  return;
};

/**
 * GET comments per post request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @return {null} returns null in case the method of request is incorrect
 */
const getLikes = async (req: NextApiRequest, res: NextApiResponse) => {
  const {id, ...query} = req.query;
  const foundLikes = await Like.find({postId: id, query});

  res.status(StatusCodes.OK).send(foundLikes);
  return;
};

/**
 * POST create a new comment request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {string} id id of the post
 * @param {any} post post to be liked
 * @return {null} returns null in case the method of request is incorrect
 */
const like = async (req: NextApiRequest, res: NextApiResponse, id: string, post: any) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Log in or create an account first to like post!",
        });
    return;
  }

  const reqLike: {
    role: string,
    userId: string
    postId: string,
  } = {
    role: token.role,
    userId: token.id,
    postId: id,
  };

  if ((reqLike.role !== "student" && reqLike.role !== "tutor")) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: "Problem with provided information (Validation Error)"});
    return;
  }

  const isLiked: boolean = post.likes.findIndex((like: {likeId: string, userId: string }) => like.userId === token.id) > -1;

  if (isLiked) {
    res.status(StatusCodes.CONFLICT).send({message: "You have already liked this post."});
    return;
  }

  const newLike = new Like(reqLike);

  try {
    post.likes.push({likedId: newLike._id.toString(), userId: token.id});

    await newLike.save();
    await post.save();
    await addActivityToUser(newLike._id.toString(), "like", undefined, token.id, token.role);
    res.status(StatusCodes.CREATED).send({
      message: "The post was successfully liked!",
      comment: newLike,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({
      message: "Error occurred during liking the post.",
      error: error,
    });
  }

  return;
};

/**
 * POST create a new comment request
 * @param {NextApiRequest} req HTTP req received from client
 * @param {NextApiResponse} res HTTP response sent to client side
 * @param {string} id id of the post
 * @param {any} post post to be liked
 * @return {null} returns null in case the method of request is incorrect
 */
const removeLike = async (req: NextApiRequest, res: NextApiResponse, id: string, post: any) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({
          message: "You are not authenticated! Log in or create an account first to like post!",
        });
    return;
  }

  const likeIndex = post.likes.findIndex((like: {likeId: string, userId: string }) => like.userId === token.id);

  if (likeIndex < 0) {
    res.status(StatusCodes.NOT_FOUND).send({message: "You have not liked this post!"});
    return;
  }

  const likeId = post.likes[likeIndex].likeId;

  try {
    await Like.findByIdAndDelete(likeId);
    post.likes.splice(likeIndex, 1);
    await post.save();
    await removeActivityFromUser(likeId, undefined, token.id, token.role);
    res.status(StatusCodes.OK).send({message: "The like has been deleted successfully!"});
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).send({
      message: "User has been possibly not found.",
      error: error});
  }
};

export default handler;
