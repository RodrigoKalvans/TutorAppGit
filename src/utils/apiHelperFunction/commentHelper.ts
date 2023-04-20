import Comment from "@/models/Comment";
import Post from "@/models/Post";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";

export const deleteCommentFromDB = async (commentId: String) => {
  const deletedComment = await Comment.findByIdAndDelete(commentId);

  // Delete comment reference form the post
  await Post.findByIdAndUpdate(deletedComment.postId, {
    $pull: {comments: {commentId: commentId}},
  });
};

/**
 * Delete comment reference from user's activity
 * @param {String} commentId id of a comment that is being deleted
 * @param {String} role role of a user who commented
 * @param {String} userId id of a user who commented
 */
export const deleteCommentFromUserActivity = async (commentId: String, role: String, userId: String) => {
  if (role === "student") {
    await Student.findByIdAndUpdate(userId, {
      $pull: {activity: {activityId: commentId}},
    },
    {safe: true},
    );
  } else {
    await Tutor.findByIdAndUpdate(userId, {
      $pull: {activity: {activityId: commentId}},
    },
    {safe: true},
    );
  }
};
