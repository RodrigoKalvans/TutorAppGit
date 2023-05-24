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
import Subject from "@/models/Subject";
import {deleteCommentFromUserActivity} from "./commentHelper";
import Like from "@/models/Like";

/**
 * Delete posts
 * Delete comments of the post
 * Delete reviews
 * Clear all activity of the user (comments, reviews, likes - to be implemented)
 * @param {any} user user that is being deleted
 */
export const deleteAllReferencesOfDeletedUser = async (user: any) => {
  // Delete posts of the user
  user.posts.forEach(async (postId: string) => {
    const deletedPost = await Post.findByIdAndDelete(postId);

    for (let i = 0; i < deletedPost.comments.length; i++) {
      const commentId = deletedPost.comments[i].commentId;

      // Delete reference in activity of a user who left a comment
      const comment = await Comment.findByIdAndDelete(commentId);

      await deleteCommentFromUserActivity(comment._id, comment.role, comment.userId);
    }

    // Delete all likes of the deleted post
    const likesIdArr = [];

    for (let i = 0; i < deletedPost.likes.length; i++) {
      const likeId = deletedPost.likes[i].likeId;
      likesIdArr.push(likeId);

      const like = await Like.findByIdAndDelete(likeId);

      await removeActivityFromUser(likeId, undefined, like.userId, like.role);
    }
  });

  // Delete all reviews that the user received, and clear the references to those reviews
  for (let i = 0; i < user.reviews.length; i++) {
    const reviewId = user.reviews[i];

    const reviewToDelete = await Review.findByIdAndDelete(reviewId);
    await removeActivityFromUser(reviewToDelete._id, undefined, reviewToDelete.reviewerUserId, reviewToDelete.reviewerUserRole);
  }

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
      // Delete review from the backend
      const deletedReview = await Review.findByIdAndDelete(activity.activityId);

      // Delete review from reviewed user
      await deleteReviewFromReviewedUser(deletedReview);
    } else if (activity.activityType === "like") {
      // Delete like from db
      const deletedLike = await Like.findByIdAndDelete(activity.activityId);

      // Delete like from post
      await Post.findByIdAndUpdate(deletedLike.postId, {
        $pull: {likes: {likeId: activity.activityId}},
      });
    }
  });

  // Delete reference to the deleted user from the people who the deleted user followed
  user.following.forEach(async (followedUser: {userId: string, role: string}) => {
    switch (followedUser.role) {
      case "tutor":
        await Tutor.findByIdAndUpdate(followedUser.userId, {
          $pull: {followers: {userId: user._id}},
        });
        break;

      case "student":
        await Student.findByIdAndUpdate(followedUser.userId, {
          $pull: {followers: {userId: user._id}},
        });
        break;

      default:
        break;
    }
  });

  // Delete reference to the deleted user from people who followed the deleted user
  user.followers.forEach(async (followingUser: {userId: string, role: string}) => {
    switch (followingUser.role) {
      case "tutor":
        await Tutor.findByIdAndUpdate(followingUser.userId, {
          $pull: {following: {userId: user._id}},
        });
        break;

      case "student":
        await Student.findByIdAndUpdate(followingUser.userId, {
          $pull: {following: {userId: user._id}},
        });
        break;

      default:
        break;
    }
  });

  // Unsubscribe tutor from subjects
  if (user.role === "tutor") {
    await Subject.updateMany({
      _id: {
        $in: user.subjects,
      },
    },
    {
      $pull: {tutors: user._id},
    });
  }
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
    followingUser = await Student.findById(token.id);
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
  } else if (followingUser._id.toString() === followedUser._id.toString()) {
    res.status(StatusCodes.FORBIDDEN).send({message: "You cannot follow yourself!"});
    return;
  }

  const exists = followedUser.followers.findIndex((follower: {_id: ObjectId, userId: String, role: String}, index: number) => follower.userId === followingUser._id.toString()) > -1;

  if (exists) {
    res.status(StatusCodes.CONFLICT).send({message: "You already follow the user!"});
    return;
  }

  followedUser.followers.push({userId: token.id, role: token.role});
  followingUser.following.push({userId: id, role: role});

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

  let user: any;

  if (token.role === "tutor") {
    user = await Tutor.findById(token.id);
  } else if (token.role === "student") {
    user = await Student.findById(token.id);
  }

  if (!user) {
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

  const followedIndex = followedUser.followers.findIndex((follower: {userId: String, role: String}) => follower.userId === user._id.toString());

  if (followedIndex === -1) {
    res.status(StatusCodes.CONFLICT).send("You do not follow this user!");
    return;
  }

  followedUser.followers.splice(followedIndex, 1);

  const followingIndex = user.following.findIndex((followed: {_id: ObjectId, userId: String, role: String}) => followed.userId === followedUser._id.toString());

  user.following.splice(followingIndex, 1);

  await followedUser.save();
  await user.save();

  res.status(StatusCodes.OK).send({followedUser: followedUser, followingUser: user});
  return;
};

export const addActivityToUser = async (activityId: string, activityType: string, user?: any, userId?: string, role?: string) => {
  if (user) {
    user.activity.push({activityId: activityId, activityType: activityType});
    await user.save();
  } else if (userId && role) {
    if (role === "tutor") {
      await Tutor.findByIdAndUpdate(userId, {
        $push: {activity: {activityId: activityId, activityType: activityType}},
      });
    } else if (role === "student") {
      await Student.findByIdAndUpdate(userId, {
        $push: {activity: {activityId: activityId, activityType: activityType}},
      });
    }
  }
};

export const removeActivityFromUser = async (activityId: string, user?: any, userId?: string, role?: string) => {
  if (user) {
    const index = user.activity.findIndex((activity: {activityId: string, activityType: string}) => activity.activityId === activityId);
    user.activity.splice(index, 1);
    await user.save();
  } else if (userId && role) {
    if (role === "tutor") {
      await Tutor.findByIdAndUpdate(userId, {
        $pull: {activity: {activityId: activityId}},
      },
      {safe: true},
      );
    } else if (role === "student") {
      await Student.findByIdAndUpdate(userId, {
        $pull: {activity: {activityId: activityId}},
      },
      {safe: true},
      );
    }
  }
};
