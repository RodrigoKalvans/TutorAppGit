import {Session} from "next-auth";
import Link from "next/link";
import {MouseEventHandler} from "react";
import useSWR from "swr";

const Comment = ({comment, handleDelete, session}: {comment: any, handleDelete: MouseEventHandler, session: Session | null}) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: user, error, isLoading} = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}/api/${comment.role}s/${comment.userId}`, fetcher);

  if (error) return <div>error</div>;
  if (isLoading) return <div>loading</div>;

  return (
    <>
      {(comment && user) &&
      <div className="w-full min-h-10 px-5 py-2 rounded-xl flex justify-between bg-gray-100">
        <div>
          <Link
            href={`/${comment.role}s/${comment.userId}`}>
            <b className="">{user.firstName + " " + user.lastName}</b>
          </Link>
          <div className="">{comment.text}</div>
        </div>

        {(session && session.user.id === comment.userId) &&

            <p
              className="text-xs cursor-pointer hover:text-current/70 transition-all my-auto"
              onClick={handleDelete}
            >
              Delete
            </p>

        }
      </div>
      }
    </>
  );
};

export default Comment;
