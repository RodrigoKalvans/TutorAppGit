import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import useSWR from "swr";
import Image from "next/image";
import {useState} from "react";
import {format} from "date-fns";
import Link from "next/link";
import commentImage from "@/public/icons/commentsIcon.png";
import likeImage from "@/public/icons/likesIcon.png";
import Comment from "./Comment";
import hamburgerMenu from "@/public/icons/hamburger-menu.svg";

/**
 * Post component
 * @param {Post} post
 * @param {any} user tutor or student
 * @return {JSX} component
 */
const Post = ({post, loggedIn}: {post: any, loggedIn: boolean}) => {
  // TODO: convert post.date into a better format
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [showEnterComment, setShowEnterComment] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: user, error, isLoading} = useSWR(`http://localhost:3000/api/${post.role}s/${post.userId}`, fetcher);
  const {data: presignedUrls, error: imagesError, isLoading: areImagesLoading} = useSWR(`http://localhost:3000/api/posts/${post._id}/image`, fetcher);

  // quietly load comments
  const {data: comments} = useSWR(`http://localhost:3000/api/comments?postId=${post._id}`, fetcher);

  if (imagesError) {
    console.log(imagesError);
  }

  const handleComment = async () => {
    const res = await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({
        text: comment,
        postId: post._id,
      }),
    });
    setComment("");
    console.log(res);
  };

  const handleLike = async () => {
    
  }

  return (
    <>
      {post &&
        <div className="flex justify-center h-fit my-5">
          <div className="flex-col bg-white text-sm rounded-2xl shadow-md w-[52rem] hov">
            {/** top section */}
            {user &&
            <div className="flex justify-between p-3 h-10 shadow-lg items-center">
              <Link href={`/${user.role}s/${user._id}`}>
                <div className="flex gap-5 items-center">
                  <div className="h-full w-8"><ProfilePicture user={user} /></div>
                  <div className="text-xl">{user.firstName + " " + user.lastName}</div>
                  |
                  <div className="uppercase">{user.role}</div>
                </div>
              </Link>
              <div className="items-center">
                {format(new Date(post.createdAt), "dd/MM/yyyy")}
              </div>
            </div>
            }
            {/** main body (description pics) */}
            <div className="p-3 text-sm flex-col">
              <div className="w-full mt-2">
                <p>{post.description}</p>
              </div>
              <div className="w-full flex justify-center my-5">
                {areImagesLoading && (
                  <p>Images are loading</p>
                )}
                {presignedUrls && (
                  <div className={`${presignedUrls.length > 1 && "carousel rounded-md"}`}>
                    {presignedUrls.map((url: string) => (
                      <Image src={url} alt="profile picture" width={400} height={400} className={`${presignedUrls.length === 1 && "rounded-md"}`} />
                    ))}
                  </div>
                )}
              </div>
              {/** everything below the pics */}
              <div className="mt-1 flex items-center justify-between">
                <div className="flex gap-5">
                  <div className="text-xs flex items-center">
                    <Image
                      src={commentImage}
                      alt={"comment"}
                      width={18}
                    />&nbsp;:
                    <div className="font-bold text-xs">&nbsp;{post.comments.length}</div>
                  </div>
                  <div className="text-xs flex items-center">
                    <Image
                      src={likeImage}
                      alt={"like"}
                      width={18}
                      onClick={(e: any) => handleLike()}
                    />&nbsp;:
                    <div className="font-bold text-xs">&nbsp;{post.likes.length}</div>
                  </div>
                </div>
                <div onClick={() => setIsExtended(!isExtended)} className="py-1 px-5 rounded-full bg-yellow-100 cursor-pointer">
                  <Image
                    src={hamburgerMenu}
                    alt={"hamburger"}
                    width={24}
                  />
                </div>
                {!loggedIn ?
                  <button className="btn btn-sm" onClick={(e: any) => setShowEnterComment(!showEnterComment)}>comment</button> :
                  <div className="w-10"></div>
                }
              </div>
              {/** comment section */}
              {showEnterComment &&
                <div className="w-full h-fit py-1 max-h-32 flex justify-around items-center">
                  <input
                    type="text"
                    placeholder="Comment"
                    className="max-h-20 overflow-hidden w-9/10"
                    value={comment}
                    onChange={(e: any) => setComment(e.target.value)}
                  />
                  <button className="btn btn-xs" onClick={(e: any) => handleComment()}>enter</button>
                </div>
              }
              {isExtended &&
                <div className={`${post.comments.length > 0 ? "max-h-32 pt-3" : "h-6"} flex flex-col gap-2`}>
                  {post.comments.length > 0 ?
                  comments && comments.map((c: any) => <Comment comment={c}/>) :
                  <div className="flex justify-center m-3">No comments have been made yet!</div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
      {error && "Error"}
      {isLoading && "Loading..."}
    </>
  );
};

export default Post;
