import Comment from "@/models/Comment";
import Post from "@/models/Post";
import Review from "@/models/Review";
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
