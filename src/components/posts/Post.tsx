import Link from "next/link";
import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import useSWR from "swr";
import comment from "@/public/icons/commentsIcon.png";
import like from "@/public/icons/likesIcon.png";
import Image from "next/image";

/**
 * Post component
 * @param {Post} post
 * @param {any} user tutor or student
 * @return {JSX} component
 */
const Post = ({post}: {post: any}) => {
  // TODO: convert post.date into a better format

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: user, error, isLoading} = useSWR(`http://localhost:3000/api/${post.role}s/${post.userId}`, fetcher);

  // placeholder
  const pics: any = [
    <Picture />,
    <Picture />,
    <Picture />,
    <Picture />,
  ];

  return (
    <>
      {post && user &&
        <main className="flex-col w-3/5 my-5 bg-white text-sm rounded-2xl shadow-md hov">
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
                  src={comment}
                  alt={"comment"}
                  width={18}
                />&nbsp;:
                <div className="font-bold text-xs">&nbsp;{post.comments.length}</div>
              </div>
              <div className="text-xs flex items-center">
                <Image
                  src={like}
                  alt={"like"}
                  width={18}
                />&nbsp;:
                <div className="font-bold text-xs">&nbsp;{post.likes.length}</div></div>
            </div>
          </div>
          <div className="p-3 text-sm flex-col">
            <div className="w-full max-h-40 p-1 overflow-scroll">+{post.description}</div>
            <div className="w-full flex justify-center">
              <div className="carousel w-1/2 rounded-box">
                {pics.map((pic: any) => <div className="carousel-item w-full">{pic}</div>)}
              </div>
            </div>
            <div className="w-full px-1 flex justify-end">{post.date}</div>
          </div>
        </main>
      }
      {error && "Error"}
      {isLoading && "Loading..."}
    </>
  );
};

export default Post;

/**
 * placeholder for image
 * @return {JSX} component
 */
const Picture = () => {
  return (
    <>
      <div className="aspect-square w-full bord">
        <div>
          pic
        </div>
      </div>
    </>
  );
};
