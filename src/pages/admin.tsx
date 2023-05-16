import Post from "@/models/Post";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";
import {deleteAllReferencesOfDeletedUser} from "@/utils/apiHelperFunction/userHelper";
import db from "@/utils/db";
import {DeleteIcon} from "@/utils/icons";
import {InferGetServerSidePropsType} from "next";
import Link from "next/link";
import {useState} from "react";

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

  const handleDeletePost = async (_id: any) => {
    const response = await fetch(`/api/posts/${_id.toString()}`, {
      method: "DELETE",
    });
    const json = await response.json();
    console.log(json);
    setPosts(posts.splice(posts.findIndex((p: any) => {
      return p._id == _id;
    })));
  };

  const handleDeleteUser = async (user: any) => {
    deleteAllReferencesOfDeletedUser(user);
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
      setUsers(users.splice(users.findIndex((u: any) => {
        return u._id.toString() == user._id.toString();
      })));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="flex gap-5 px-10 min-h-screen w-9/10 justify-between">
        <div className="w-fit h-fit">
          {posts && posts.map((post: any) => (
            <div key={post._id} className="flex items-center">
              <div className="flex flex-col my-2">
                {post._id}&nbsp;
                {post.role}&nbsp;
                {post.userId}&nbsp;
              </div>
              <DeleteIcon onClick={() => handleDeletePost(post._id)} />
            </div>
          ))}
        </div>
        <div className="w-fit h-fit">
          {users && users.map((user: any) => (
            <div key={user._id} className="flex items-center">
              <Link href={`/${user.role}s/${user._id}`} >
                <div className="flex flex-col my-2">
                  {user._id}&nbsp;
                  {user.role}&nbsp;
                  {user.firstName + " " + user.lastName}&nbsp;
                </div>
              </Link>
              <DeleteIcon onClick={() => handleDeleteUser(user)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Admin;

export const getServerSideProps = async () => {
  db.connect();
  const posts = await Post.find();
  const users = [];
  users.push(...await Tutor.find());
  users.push(...await Student.find());
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      users: JSON.parse(JSON.stringify(users)),
    },
  };
};
