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
import FeaturedTutors from "@/models/FeaturedTutor";

/**
 * This page can be accessed by admin to delete posts and users
 * @param {InferGetServerSidePropsType} props
 * @return {JSX}
 */
const Admin = (
    props: InferGetServerSidePropsType<any>,
) => {
  const [posts, setPosts] = useState<Array<any>>(props.posts);
  const [users, setUsers] = useState<Array<any>>(props.users);
  const [reviews, setReviews] = useState<Array<any>>(props.reviews);
  const [comments, setComments] = useState<Array<any>>(props.comments);
  const [subjects, setSubjects] = useState<Array<any>>(props.subjects);
  const [featuredTutors, setFeaturedTutors] = useState<Array<any>>(props.featuredTutors);

  const [newSubjectName, setNewSubjectName] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  // fields that will be displayed for each object type
  const postFields = ["_id", "userId", "role", "description"];
  const userFields = ["_id", "role", "firstName", "lastName", "email", "posts"];
  const reviewFields = ["_id", "reviewerUserRole", "reviewerUserId", "reviewedUserRole", "reviewedUserId", "rating", "text"];
  const commentFields = ["_id", "role", "userId", "postId", "text"];
  const subjectFields = ["_id", "name"];
  const featuredTutorsFields = ["_id", "tutorId"];

  const handleDeletePost = useCallback(async (post: any) => {
    const response = await fetch(`/api/posts/${post._id.toString()}`, {
      method: "DELETE",
    });
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

    if (!response.ok) return;
    setComments((oldValues) => {
      return oldValues.filter((c) => c._id.toString() !== comment._id);
    });
  }, []);

  const handleDeleteReview = useCallback(async (review: any) => {
    const response = await fetch(`/api/reviews/${review._id.toString()}`, {
      method: "DELETE",
    });

    if (!response.ok) return;
    setReviews((oldValues) => {
      return oldValues.filter((r) => r._id.toString() !== review._id);
    });
  }, []);

  const handleDeleteSubject = useCallback(async (subject: any) => {
    const response = await fetch(`/api/subjects/${subject._id.toString()}`, {
      method: "DELETE",
    });

    if (!response.ok) return;
    setSubjects((oldValues) => {
      return oldValues.filter((s) => s._id.toString() !== subject._id);
    });
  }, []);

  const handleDeleteFeaturedTutor = useCallback(async (featuredTutor: any) => {
    const response = await fetch(`/api/featuredTutors/${featuredTutor._id.toString()}`, {
      method: "DELETE",
    });

    if (!response.ok) console.error(response);
    else {
      setFeaturedTutors((oldValues) => {
        return oldValues.filter((ft) => ft._id.toString() !== featuredTutor._id);
      });
    }
  }, []);

  const handlePostSubject = async (event: any) => {
    event.preventDefault();
    const name = event.target.name.value.replace(/\s+/g, "").toLowerCase();
    const iconBase = event.target.icon.files[0];
    const iconOrange = event.target.iconOrange.files[0];

    await uploadToServer(iconBase, `${name}.svg`);
    await uploadToServer(iconOrange, `${name}Orange.svg`);

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        body: JSON.stringify({
          name: event.target.name.value,
        }),
      });
      if (!response.ok) console.error(response);
      else {
        setSubjects((oldValues) => {
          return oldValues.filter(async (s) => s._id.toString() !== (await response.json())._id);
        });
      }
    } catch (err) {
      console.error(err);
      alert("Check the console to see the error");
    }
  };

  const uploadToServer = async (image: any, name: string) => {
    const form = new FormData();
    form.append("image", image);
    form.append("name", name);
    const response = await fetch("/api/iconUpload", {
      method: "POST",
      body: form,
    });
    console.log(await response.json());
  };

  const handlePostFeaturedTutor = async (event: any) => {
    event.preventDefault();
    const tutorId = event.target.id.value;
    console.log(tutorId);
    const response = await fetch("/api/featuredTutors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tutorId,
      }),
    });
    if (!response.ok) console.error(response);
    else {
      const newFT = await response.json();
      setFeaturedTutors((oldValues) => {
        return [...oldValues, newFT];
      });
      console.log(newFT);
    }
  };

  const buttonDisable = () => {
    setIsButtonDisabled(true);
    const COOLDOWN = 10000; // 10 seconds
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, COOLDOWN);
  };

  return (
    <>
      <div className="flex flex-col px-10 min-h-screen justify-between overflow-scroll">
        <section className="flex flex-wrap gap-10">
          <div className="flex flex-col m-5 capitalize">
            <b className="border-b-dotted">Number of entries</b>
            <div>users: {users.length}</div>
            <div>posts: {posts.length}</div>
            <div>reviews: {reviews.length}</div>
            <div>comments: {comments.length}</div>
            <div>subjects: {subjects.length}</div>
            <div>featured tutors: {featuredTutors.length}</div>
          </div>
          <div className="flex flex-col m-5">
            <h2>Create subject (files must be SVGs)</h2>
            <form action="submit" onSubmit={handlePostSubject} className="flex flex-col gap-1">
              <div className="flex flex-row">
                <input
                  type="text"
                  placeholder="Subject Name"
                  name="name"
                  onChange={(e) => setNewSubjectName(e.target.value.toLowerCase())}
                  required
                />
                <div className="flex flex-col">
                  <input
                    type="file"
                    name="icon"
                    required
                    accept=".svg"
                  />
                  <div>file name: {`${newSubjectName}`}</div>
                </div>
                <div>
                  <input
                    type="file"
                    name="iconOrange"
                    required
                    accept=".svg"
                  />
                  <div>file name: {`${newSubjectName}Orange`}</div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`btn-sm ${isButtonDisabled ? "bg-black text-white" : "bg-orange-310"} `}
                  disabled={isButtonDisabled}
                  onClick={buttonDisable}
                >{isButtonDisabled ? "Disabled..." : "Add Subject"}</button>
              </div>
            </form>
          </div>
          <div className="m-5 capitalize">
            <h2>add featured tutor</h2>
            <form action="submit" onSubmit={handlePostFeaturedTutor}>
              <input type="text" name="id" required placeholder="id"/>
              <button
                type="submit"
                className="btn-sm bg-orange-310"
                disabled={isButtonDisabled}
                onClick={buttonDisable}
              >{isButtonDisabled ? "Disabled..." : "Add Tutor"}
              </button>
            </form>
          </div>
        </section>
        <section className="flex justify-center">
          <AdminSection title={"posts"} fields={postFields} content={posts} deleteFunction={handleDeletePost} />
          <AdminSection title={"users"} fields={userFields} content={users} deleteFunction={handleDeleteUser} />
          <AdminSection title={"reviews"} fields={reviewFields} content={reviews} deleteFunction={handleDeleteReview} />
          <AdminSection title={"comments"} fields={commentFields} content={comments} deleteFunction={handleDeleteComment} />
          <AdminSection title={"subjects"} fields={subjectFields} content={subjects} deleteFunction={handleDeleteSubject} />
          <AdminSection title={"featured tutors"} fields={featuredTutorsFields} content={featuredTutors} deleteFunction={handleDeleteFeaturedTutor} />
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
  const featuredTutors = await FeaturedTutors.find();
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      users: JSON.parse(JSON.stringify(users)),
      comments: JSON.parse(JSON.stringify(comments)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      subjects: JSON.parse(JSON.stringify(subjects)),
      featuredTutors: JSON.parse(JSON.stringify(featuredTutors)),
    },
  };
};
