import Post from "@/models/Post";
import Review from "@/models/Review";
import Comment from "@/models/Comment";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import db from "@/utils/db";
import {InferGetServerSidePropsType} from "next";
import {useCallback, useState} from "react";
import Subject from "@/models/Subject";
import AdminSection from "@/components/admin/AdminSection";

/**
 * This page can be accessed by admin to delete posts and users
 * @param {InferGetServerSidePropsType} props
 * @return {JSX}
 */
const Admin = (
    props: InferGetServerSidePropsType<any>, // users, posts
) => {
  const [posts, setPosts] = useState<Array<any>>(props.posts);
  const [users, setUsers] = useState<Array<any>>(props.users);
  const [reviews, setReviews] = useState<Array<any>>(props.reviews);
  const [comments, setComments] = useState<Array<any>>(props.comments);
  const [subjects, setSubjects] = useState<Array<any>>(props.subjects);

  // fields that will be displayed for each object type
  const postFields = ["_id", "userId", "role", "description"];
  const userFields = ["_id", "role", "firstName", "lastName", "email", "posts"];
  const reviewFields = ["_id", "reviewerUserRole", "reviewerUserId", "reviewedUserRole", "reviewedUserId", "rating", "text"];
  const commentFields = ["_id", "role", "userId", "postId", "text"];
  const subjectFields = ["_id", "name"];

  const handleDeletePost = useCallback(async (post: any) => {
    const response = await fetch(`/api/posts/${post._id.toString()}`, {
      method: "DELETE",
    });
    const json = await response.json();
    console.log(json);
    if (!response.ok) return;
    setPosts((oldValues) => {
      return oldValues.filter((p) => p._id.toString() !== post._id);
    });
  }, []);

  const handleDeleteUser = useCallback(async (user: any) => {
    let response;
    if (user.role == "tutor") {
      response = await fetch(`/api/tutors/${user._id.toString()}`, {
        method: "DELETE",
      });
    } else if (user.role == "student") {
      response = await fetch(`/api/students/${user._id.toString()}`, {
        method: "DELETE",
      });
    }
    try {
      const json = await response?.json();
      console.log(json);
      if (!response?.ok) return;
      setUsers((oldValues) => {
        return oldValues.filter((u) => u._id.toString() !== user._id);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleDeleteComment = useCallback(async (comment: any) => {
    const response = await fetch(`/api/comments/${comment._id.toString()}`, {
      method: "DELETE",
    });
    const json = await response.json();
    console.log(json);
    if (!response.ok) return;
    setComments((oldValues) => {
      return oldValues.filter((c) => c._id.toString() !== comment._id);
    });
  }, []);

  const handleDeleteReview = useCallback(async (review: any) => {
    const response = await fetch(`/api/reviews/${review._id.toString()}`, {
      method: "DELETE",
    });
    const json = await response.json();
    console.log(json);
    if (!response.ok) return;
    setReviews((oldValues) => {
      return oldValues.filter((r) => r._id.toString() !== review._id);
    });
  }, []);

  const handleDeleteSubject = useCallback(async (subject: any) => {
    const response = await fetch(`/api/subjects/${subject._id.toString()}`, {
      method: "DELETE",
    });
    const json = await response.json();
    console.log(json);
    if (!response.ok) return;
    setSubjects((oldValues) => {
      return oldValues.filter((s) => s._id.toString() !== subject._id);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col px-10 min-h-screen justify-between">
        <section className="flex flex-col p-2 capitalize">
          <b className="border-b-dotted">Number of entries</b>
          <div>users: {users.length}</div>
          <div>posts: {posts.length}</div>
          <div>reviews: {reviews.length}</div>
          <div>comments: {comments.length}</div>
          <div>subjects: {subjects.length}</div>
        </section>
        <section className="flex justify-center">
          <AdminSection title={"posts"} fields={postFields} content={posts} deleteFunction={handleDeletePost} />
          <AdminSection title={"users"} fields={userFields} content={users} deleteFunction={handleDeleteUser} />
          <AdminSection title={"reviews"} fields={reviewFields} content={reviews} deleteFunction={handleDeleteReview} />
          <AdminSection title={"comments"} fields={commentFields} content={comments} deleteFunction={handleDeleteComment} />
          <AdminSection title={"subjects"} fields={subjectFields} content={subjects} deleteFunction={handleDeleteSubject} />
        </section>
      </div>
    </>
  );
};

export default Admin;

export const getServerSideProps = async () => {
  db.connect();
  const posts = await Post.find();
  const students = await Student.find();
  const tutors = await Tutor.find();
  const users = [...tutors, ...students];
  const comments = await Comment.find();
  const reviews = await Review.find();
  const subjects = await Subject.find();
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      users: JSON.parse(JSON.stringify(users)),
      comments: JSON.parse(JSON.stringify(comments)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      subjects: JSON.parse(JSON.stringify(subjects)),
    },
  };
};
