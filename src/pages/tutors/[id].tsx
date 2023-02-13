import Tutor from "@/models/Tutor";
import db from "@/utils/db";
import {NextPageContext} from "next";
import {useRouter} from "next/router";
import {useState} from "react";

const TutorPage = ({tutor}: {tutor: any}) => {
  const router = useRouter();
  const {id} = router.query;

  const [followers, setFollowers] = useState(tutor.followers.length);
  const handleFollow = async () => {
    const res = await fetch(`http://localhost:3000/api/tutors/${id}/follow`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

    const json = await res.json();

    if (json.message) {
      console.log(json.message);
    } else {
      console.log(json);
      setFollowers(followers+1);
    }
  };

  const handleUnfollow = async () => {
    const res = await fetch(`http://localhost:3000/api/tutors/${id}/unfollow`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

    const json = await res.json();

    if (json.message) {
      console.log(json.message);
    } else {
      console.log(json);
      setFollowers(followers-1);
    }
  };

  return (
    <>
      {tutor && (
        <div>
          <h1>{tutor.firstName} {tutor.lastName}</h1>
          <p>Followers: {followers}</p>
          <div>
            <button onClick={async () => await handleFollow()}>Follow</button>
          </div>
          <div>
            <button onClick={async () => await handleUnfollow()}>Unfollow</button>
          </div>
        </div>
      )}

      {!tutor && (
        <p>No tutor was found!</p>
      )}
    </>
  );
};

export default TutorPage;


export const getServerSideProps = async (context: NextPageContext) => {
  await db.connect();
  let tutor = await Tutor.findById(context.query.id);
  tutor = JSON.parse(JSON.stringify(tutor));

  return {
    props: {
      tutor,
    },
  };
};
