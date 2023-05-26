import {useState} from "react";

const FollowButton = ({role, id, followers, setFollowers, isFollowed, setIsFollowed}: {role: String, id: String, followers: number, setFollowers: Function, isFollowed: boolean, setIsFollowed: Function}) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    const res = await fetch(`/api/${role}s/${id}/follow`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

    const json = await res.json();

    if (json.message) {
      console.log(json.message);
    } else if (res.ok) {
      console.log(json);
      setFollowers(followers+1);
      setLoading(false);
      setIsFollowed(true);
    }
  };

  const handleUnfollow = async () => {
    setLoading(true);
    const res = await fetch(`/api/${role}s/${id}/unfollow`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

    const json = await res.json();

    if (json.message) {
      console.log(json.message);
    } else if (res.ok) {
      console.log(json);
      setFollowers(followers-1);
      setLoading(false);
      setIsFollowed(false);
    }
  };
  return (
    <>
      {!isFollowed && (
        <button type="button" className={`btn btn-sm bg-orange-500 hover:bg-orange-400 rounded-3xl px-5 text-white normal-case border-0 font-light ${loading && ("loading bg-gray-400")}`}onClick={async () => await handleFollow()} disabled={loading}>Follow</button>
      )}
      {isFollowed && (
        <button type="button" className={`btn btn-sm btn-primary rounded-3xl normal-case border-0 font-light ${loading && ("loading bg-gray-400")}`} onClick={async () => await handleUnfollow()} disabled={loading}>Unfollow</button>
      )}
    </>

  );
};

export default FollowButton;
