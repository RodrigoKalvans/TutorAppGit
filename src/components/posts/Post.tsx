import ProfilePicture from "../profilePage/helpingComponents/ProfilePicture";
import useSWR from "swr";
import Image from "next/image";
import {useEffect, useState} from "react";
import {format} from "date-fns";
import Link from "next/link";
import Comment from "./Comment";
import {DeleteIcon, LikeIcon, LoadingIcon, PromoIcon} from "@/utils/icons";
import {Session} from "next-auth";
import {isPromoted} from "@/utils/promotion";
import styles from "@/styles/Post.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomNextArrow = (props: any) => {
  const {onClick} = props;
  return (
    <div
      className={`${styles.slickNext}`}
      onClick={onClick}
    >
      {">"}
    </div>
  );
};

const CustomPrevArrow = (props: any) => {
  const {onClick} = props;
  return (
    <div
      className={`${styles.slickPrev}`}
      onClick={onClick}
    />
  );
};

const fetcher = (url: string) => fetch(url).then((res) => res.json()).catch((res) => res.json());

const settings = {
  dots: true,
  autoplay: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
};

/**
 * Post component
 * @param {Post} post
 * @param {number} index
 * @param {Function} handleDelete
 * @param {Session | null} session
 * @return {JSX} component
 */
const Post = ({
  post,
  index,
  handleDelete,
  session,
} : {
  post: any,
  index: number,
  handleDelete: Function,
  session: Session | null
}) => {
  const [isExtended, setIsExtended] = useState<boolean>(false);
  const [commentsArray, setCommentsArray] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.likes.length);

  const {data: user, error, isLoading} = useSWR(post ?`/api/${post.role}s/${post.userId}` : null, fetcher);
  const {data: presignedUrls, error: imagesError, isLoading: areImagesLoading} = useSWR(post ? `/api/posts/${post._id.toString()}/image` : null, fetcher);

  // quietly load comments
  const {data: comments}: {data: Array<any>} = useSWR(`/api/comments?postId=${post._id.toString()}`, fetcher);

  useEffect(() => {
    if (comments) setCommentsArray(comments);

    return () => setCommentsArray([]);
  }, [comments]);

  useEffect(() => {
    if (session && post.likes.findIndex((like: {likeId: string, userId: string}) => like.userId === session.user.id) > -1) {
      setIsLiked(true);
    }
  }, [session, post]);

  const handleLike = async () => {
    if (isLiked) {
      const response = await fetch(`/api/posts/${post._id.toString()}/likes`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIsLiked(false);
        setLikeCount(likeCount-1);
      }
    } else {
      const response = await fetch(`/api/posts/${post._id.toString()}/likes`, {
        method: "POST",
      });

      if (response.ok) {
        setIsLiked(true);
        setLikeCount(likeCount+1);
      }
    }
  };

  const handleComment = async (e: any) => {
    e.preventDefault();
    const c: {
      text: string,
      postId: string,
    } = {
      text: comment,
      postId: post._id.toString(),
    };
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify(c),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const json = await res.json();
      commentsArray.push(json.comment);
      setCommentsArray(commentsArray);
    }
    setComment("");
  };

  const handleCommentDelete = async (id: string) => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setCommentsArray((oldValues) => {
        return oldValues.filter((comment) => comment._id.toString() !== id);
      });
    }
  };

  return (
    <>
      {post && !isLoading &&
        <div className={`${styles.post} hov`}>
          {/** top section */}
          {user && !isLoading && (
            <div className="flex gap-1 justify-between items-center px-3 py-1 shadow-lg">
              <Link href={`/${user.role}s/${user._id}`}>
                <div className="flex gap-1 sm:gap-2 md:gap-5 items-center">
                  <div className="w-8">
                    <ProfilePicture user={user} />
                  </div>
                  <p className="text-sm sm:text-base md:text-xl">{user.firstName + " " + user.lastName}</p>
                  {isPromoted(user.donations) && <PromoIcon size={15} className="-mx-2 -ml-3" fill="orange"></PromoIcon>}
                  <p>|</p>
                  <p className="capitalize md:uppercase m-0 text-sm sm:text-base md:text-lg">{user.role}</p>
                </div>
              </Link>
              <p className="text-xs">
                {format(new Date(post.createdAt), "dd/MM/yyyy")}
              </p>
            </div>
          )
          }
          {/** main body (description pics) */}
          <div className="p-3 text-sm flex-col">
            <div className="mt-2 break-words hyphens-manual">
              <p className="">{post.description}</p>
            </div>
            <div className="my-5">
              {areImagesLoading && (
                <p>Images are loading</p>
              )}
              {presignedUrls && !areImagesLoading && (
                <Slider {...settings} lazyLoad="ondemand">
                  {presignedUrls.map((url: string, index: number) =>

                    <div key={index} className="flex justify-center relative">
                      <Image key={index} src={url} unoptimized alt="profile picture" width={400} height={400} className={`${presignedUrls.length === 1 && "rounded-md"} mx-auto`} />
                    </div>,

                  )}
                </Slider>
              )}
              {imagesError && <p>Error occurred while fetching the images for this post.</p>}
            </div>
            {/** everything below the pics */}
            <div className="mt-1 flex items-center justify-between">
              <div className="flex gap-5">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleLike}
                    disabled={!session}
                    className="active:scale-125 scale-100 transition-all"
                  >
                    <LikeIcon color="#527695" opacity={isLiked ? 1: 0.5} size={18} className="transition-all" />
                  </button>
                  <div className="text-xs font-normal">&nbsp;{likeCount}</div>
                </div>
                <div className="text-xs flex items-center cursor-pointer" onClick={() => setIsExtended(!isExtended)}
                >
                  <Image
                    src={"/icons/commentsIcon.png"}
                    alt={"comment"}
                    width={18}
                    height={18}
                  />&nbsp;:
                  <div className="text-xs font-normal">&nbsp;{commentsArray.length}</div>
                </div>
              </div>
              {(session && session.user.id === post.userId) && (
                <button
                  type="button"
                  className="hover:opacity-80 transition-all"
                  onClick={() => handleDelete(index)}
                >
                  <DeleteIcon size={18} color="#E0115F" />
                </button>
              )}
            </div>
            {isExtended && (
              <div>
                {session &&
                      <form
                        onSubmit={(e: any) => handleComment(e)}
                        className="w-full h-fit py-4 max-h-32 flex justify-around items-center"
                      >
                        <input
                          type="text"
                          placeholder="Comment"
                          className="max-h-20 overflow-hidden w-9/10 focus:outline-none bg-gray-50 focus:bg-gray-100 transition-colors"
                          value={comment}
                          onChange={(e: any) => setComment(e.target.value)}
                        />
                        <button type="submit" className="btn btn-xs">enter</button>
                      </form>
                }
                <div className={`${commentsArray.length > 0 ? "max-h-80 pt-3 overflow-auto" : "h-6"} flex flex-col gap-3`}>
                  {commentsArray ? commentsArray.map((c: any) =>
                    <Comment key={c._id} comment={c} handleDelete={() => handleCommentDelete(c._id.toString())} session={session} />).reverse() :
                      <div className="flex justify-center m-3">No comments have been made yet!</div>
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      }
      {error && "Error"}
      {isLoading && <LoadingIcon className="animate-spin" />}
    </>
  );
};

export default Post;
