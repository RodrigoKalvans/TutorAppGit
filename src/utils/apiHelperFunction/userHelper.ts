import Comment from "@/models/Comment";
import Post from "@/models/Post";
import Review from "@/models/Review";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import {StatusCodes} from "http-status-codes";
import {ObjectId} from "mongoose";
import {getToken} from "next-auth/jwt";
import {NextApiRequest, NextApiResponse} from "next/types";
import {deleteReviewFromReviewedUser} from "./reviewHelper";

/**
 * Delete posts
 * Delete comments of the post
 * Clear all activity of the user (comments, reviews, likes - to be implemented)
 * @param {any} user user that is being deleted
 */
export const deleteAllReferencesOfDeletedUser = async (user: any) => {
  // Delete posts of the user
  user.posts.forEach(async (post: {postId: String}) => {
    const deletedPost = await Post.findByIdAndDelete(post.postId);

    // Delete all comments
    const arr = [];

    for (let i = 0; i < deletedPost.comments.length; i++) {
      arr.push(deletedPost.comments[i].commentId);
    }

    await Comment.deleteMany({
      _id: {
        $in: arr,
      },
    });
  });

  // Delete all user's activity from db
  user.activity.forEach(async (activity: {activityId: String, activityType: String}) => {
    if (activity.activityType === "comment") {
      // Delete comment from db
      const deletedComment = await Comment.findByIdAndDelete(activity.activityId);

      // Delete comment from post
      await Post.findByIdAndUpdate(deletedComment.postId, {
        $pull: {comments: {commentId: activity.activityId}},
      });
    } else if (activity.activityType === "review") {
      const deletedReview = await Review.findByIdAndDelete(activity.activityId);

      await deleteReviewFromReviewedUser(deletedReview._id, deletedReview.reviewedUserRole, deletedReview.reviewedUserId);
    } else if (activity.activityType === "like") {
      console.log("LIKE FUNCTIONALITY TO BE ADDED");
    }
  });
};

export const followUser = async (req: NextApiRequest, res: NextApiResponse, id: String, role: String) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not authenticated! Log in or create an account first to follow others!"});
    return;
  }

  let followingUser: any;

  if (token.role === "tutor") {
    followingUser = await Tutor.findById(token.id);
  } else if (token.role === "student") {
    followingUser === await Student.findById(token.id);
  }

  if (!followingUser) {
    res.setHeader("Set-Cookie", "next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;");
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "The user you are logged in as cannot be found! Your account was either deleted or blocked. Please, update the page."});
    return;
  }

  let followedUser: any;

  if (role === "student") {
    followedUser = await Student.findById(id);
  } else if (role === "tutor") {
    followedUser = await Tutor.findById(id);
  }

  if (!followedUser) {
    res.status(StatusCodes.NOT_FOUND).send({message: "User to follow was not found!"});
    return;
  }

  const exists = followedUser.followers.findIndex((follower: {_id: ObjectId, userId: String, accountType: String}, index: number) => follower.userId === followingUser._id.toString()) > -1;

  if (exists) {
    res.status(StatusCodes.CONFLICT).send({message: "You already follow the user!"});
    return;
  }

  followedUser.followers.push({userId: token.id, accountType: token.role});
  followingUser.following.push({userId: id, accountType: role});

  await followedUser.save();
  await followingUser.save();

  res.status(StatusCodes.OK).send({followedUser: followedUser, followingUser: followingUser});
  return;
};

export const unfollowUser = async (req: NextApiRequest, res: NextApiResponse, id: String, role: String) => {
  const token = await getToken({req});

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).send({message: "You are not authenticated! Log in or create an account first to unfollow others!"});
    return;
  }

  let followingUser: any;

  if (token.role === "tutor") {
    followingUser = await Tutor.findById(token.id);
  } else if (token.role === "student") {
    followingUser === await Student.findById(token.id);
  }

  if (!followingUser) {
    res.setHeader("Set-Cookie", "next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;");
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({message: "The user you are logged in as cannot be found! Your account was either deleted or blocked. Please, update the page."});
    return;
  }

  let followedUser: any;

  if (role === "student") {
    followedUser = await Student.findById(id);
  } else if (role === "tutor") {
    followedUser = await Tutor.findById(id);
  }

  if (!followedUser) {
    res.status(StatusCodes.NOT_FOUND).send({message: "User to follow was not found!"});
    return;
  }

  const followedIndex = followedUser.followers.findIndex((follower: {userId: String, accountType: String}) => follower.userId === followingUser._id.toString());

  if (followedIndex === -1) {
    res.status(StatusCodes.CONFLICT).send("You do not follow this user!");
    return;
  }

  followedUser.followers.splice(followedIndex, 1);

  const followingIndex = followingUser.following.findIndex((followed: {_id: ObjectId, userId: String, accountType: String}) => followed.userId === followedUser._id.toString());

  followingUser.following.splice(followingIndex, 1);

  await followedUser.save();
  await followingUser.save();

  res.status(StatusCodes.OK).send({followedUser: followedUser, followingUser: followingUser});
  return;
};
