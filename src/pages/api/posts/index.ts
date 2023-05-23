import {StatusCodes} from "http-status-codes";
import {NextApiResponse, NextApiRequest} from "next";
import db from "@/utils/db";
import Post from "../../../models/Post";
import {JWT, getToken} from "next-auth/jwt";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import {MAX_POST_DESCRIPTION_LENGTH, NR_OF_POSTS_PER_PAGE} from "@/utils/consts";

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
  const token = await getToken({req});
  const page = req.query.page;
  const startingPost = req.query.startingPost;
  let query: {
    userId?: string | { $in: Array<any>; },
    _id?: { $lte: string },
  } = {};

  if (req.query.userId) { // profile page
    query = {
      userId: req.query.userId.toString(),
    };
  } else if (req.query.follow) { // follow feed
    // only allow follow feed for logged in users
    if (!token) {
      res.status(StatusCodes.NOT_FOUND).send({message: "Can't view follow feed if user is not logged in"});
      return;
    }
    query = {
      userId: {
        $in: await followedIds(token),
      },
    };
  }

  // this ensures that duplicates are not added to the response in case a post is created while the user is scrolling
  if (startingPost) {
    query._id = {$lte: startingPost.toString()};
  }

  const posts = await Post.find(query)
      .sort({createdAt: -1})
      .skip(NR_OF_POSTS_PER_PAGE * Number(page))
      .limit(NR_OF_POSTS_PER_PAGE);

  if (!posts) res.status(StatusCodes.NOT_FOUND).send({message: "No posts were found"});

  res.status(StatusCodes.OK).send(posts);

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

  if (reqPost.description.length > MAX_POST_DESCRIPTION_LENGTH) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send({message: `Post description exceeds ${MAX_POST_DESCRIPTION_LENGTH} character limit`});
    return;
  } else if (reqPost.role !== "student" && reqPost.role !== "tutor" && reqPost.role !== "admin") {
    res.status(StatusCodes.UNAUTHORIZED)
        .send({message: "Invalid role"});
    return;
  } else if (!reqPost.description && !reqPost.images) {
    res.status(StatusCodes.NO_CONTENT)
        .send({message: "Content is missing"});
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

/**
 * This is used to generate an array of followed users' ids
 * @param {JWT | null} token
 * @return {Array<string>} IDs of users followed by the user making the request
 */
const followedIds = async (token: JWT | null) => {
  let user;
  // admins should always start as tutors
  token?.role == "student" ?
  user = await Student.findById(token?.id) :
  user = await Tutor.findById(token?.id);
  console.log(user);
  const arr = [];
  for (let i = 0; i < user.following.length; i++) {
    arr.push(user.following.at(i).userId);
  }
  return arr;
};
