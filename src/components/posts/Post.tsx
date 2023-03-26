import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import useSWR from "swr";

/**
 * 
 * @param {Post} post
 * @param {Tutor || Student} user
 * @return JSX
 */
const Post = ({post}: {post: any}) => {
  // TODO: convert post.date into a better format

  const fetcher = (url: string) => fetch(url).then((res) => res.json())
  const {data: user, error, isLoading} = useSWR(`http://localhost:3000/api/${post.role}s/${post.userId}`, fetcher);

  return (
    <>
      {post && user && 
        <main className="flex-col w-full my-5 bg-white text-sm rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500">
          <div className="flex justify-between p-3 h-10 shadow-lg items-center">
            <div className="flex gap-5 items-center">
              <div className="h-full w-8"><ProfilePicture /></div>
              <div className="text-xl">{user.firstName + " " + user.lastName}</div>
              |
              <div className="uppercase">{user.role}</div>
            </div>
            <div className="flex gap-5 items-center">
              <div className="text-xs flex">comments: <div className="font-bold text-sm">&nbsp;{post.comments.length}</div></div>
              <div className="text-xs flex">likes: <div className="font-bold text-sm">&nbsp;{post.likes.length}</div></div>
            </div>
          </div>
          <div className="p-3 text-sm max-h-60 h-fit">
            <div className="w-full max-h-40 p-1 overflow-hidden">{post.description}</div>
            <div className="w-full p-1 flex justify-end">{post.date}</div>
          </div>
        </main>
      }
      {error && "Error"}
      {isLoading && "Loading..."}
    </>
  )
}

export default Post;
