import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import useSWR from "swr";
import Image from "next/image";
import {useState} from "react";
import {format} from "date-fns";
import Link from "next/link";
import comment from "@/public/icons/commentsIcon.png";
import like from "@/public/icons/likesIcon.png";

/**
 * Post component
 * @param {Post} post
 * @param {any} user tutor or student
 * @return {JSX} component
 */
const Post = ({post}: {post: any}) => {
  // TODO: convert post.date into a better format
  const [isExtended, setIsExtended] = useState(false);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: user, error, isLoading} = useSWR(`http://localhost:3000/api/${post.role}s/${post.userId}`, fetcher);
  const {data: presignedUrls, error: imagesError, isLoading: areImagesLoading} = useSWR(`http://localhost:3000/api/posts/${post._id}/image`, fetcher);

  if (imagesError) {
    console.log(imagesError);
  }

  return (
    <>
      {post && user &&
        <div className="flex-col my-5 bg-white text-sm rounded-2xl shadow-md hov">
          {/** top section */}
          <div className="flex justify-between p-3 h-10 shadow-lg items-center">
            <Link href={`/${user.role}s/${user._id}`}>
              <div className="flex gap-5 items-center">
                <div className="h-full w-8"><ProfilePicture user={user} /></div>
                <div className="text-xl">{user.firstName + " " + user.lastName}</div>
                |
                <div className="uppercase">{user.role}</div>
              </div>
            </Link>
            <div className="flex gap-5 items-center">
              <div className="text-xs flex items-center">
                <Image
                  src={like}
                  alt={"like"}
                  width={18}
                />&nbsp;:
                <div className="font-bold text-xs">&nbsp;{post.likes.length}</div></div>
            </div>
          </div>
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
            <hr/>
            <div onClick={() => setIsExtended(!isExtended)} className="mt-1 flex items-center cursor-pointer">
              <div className="text-xs flex items-center">
                <Image
                  src={comment}
                  alt={"comment"}
                  width={18}
                />&nbsp;:
                <div className="font-bold text-xs">&nbsp;{post.comments.length}</div>
              </div>
              <div className="w-full px-1 flex justify-end">
                {/* <Date dateString={`${post.date}`}/> */}
                {format(new Date(post.createdAt), "dd/MM/yyyy")}
              </div>
            </div>
            {/** comment section */}
            {isExtended &&
              <>
                <hr/>
                <div className="">
                  <p>Comments go here</p>
                </div>
              </>
            }
          </div>
        </div>
      }
      {error && "Error"}
      {isLoading && "Loading..."}
    </>
  );
};

export default Post;
