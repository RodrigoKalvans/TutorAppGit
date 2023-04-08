import Link from "next/link";
import useSWR from "swr";

const Comment = ({comment}: {comment: any}) => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const {data: user, error, isLoading} = useSWR(`http://localhost:3000/api/${comment.role}s/${comment.userId}`, fetcher);

  if (error) return <div>error</div>;
  if (isLoading) return <div>loading</div>;

  return (
    <>
      {comment && user &&
      <div className="w-full min-h-10 bg-blue-100 rounded-xl">
        <div className="ml-5">
          <Link
            href={`/${comment.role}s/${comment.userId}`}>
            <b className="">{user.firstName + " " + user.lastName}</b>
          </Link>
          <div className="">{comment.text}</div>
        </div>
      </div>
      }
    </>
  );
};

export default Comment;
