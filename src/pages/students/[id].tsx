import BoxContainer from "@/components/profilePage/helpingComponents/BoxContainer";
import ProfilePicture from "@/components/profilePage/helpingComponents/ProfilePicture";
import ProfileSection from "@/components/profilePage/ProfileSection";
import Student from "@/models/Student";
import db from "@/utils/db";
import {ObjectId} from "mongoose";
import {NextPageContext} from "next";
import Head from "next/head";
import {useRouter} from "next/router";
import {useState} from "react";

const StudentPage = ({student, isFollowing}: {student: any, isFollowing: boolean}) => {
  const router = useRouter();
  const {id} = router.query;

  const [followers, setFollowers] = useState(student.followers.length);

  const handleFollow = async () => {
    const res = await fetch(`http://localhost:3000/api/students/${id}/follow`,
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
    const res = await fetch(`http://localhost:3000/api/students/${id}/unfollow`,
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

  const fullName = `${student.firstName} ${student.lastName}`;

  return (
    <>
      {student && (
        <>
          <Head>
            <title>{fullName}</title>
          </Head>

          <main className="w-full h-screen px-28">
            <div className="w-full flex justify-around">

              <ProfileSection user={student} role="tutor"></ProfileSection>

              <BoxContainer >
                <p>Hello world</p>
              </BoxContainer>

            </div>


          </main>

        </>

      )}
    </>
  );
};

export default StudentPage;

export const getServerSideProps = async (context: NextPageContext) => {
  await db.connect();
  let student = await Student.findById(context.query.id);
  student = JSON.parse(JSON.stringify(student));

  const isFollowing = student.followers.findIndex((follower: {_id: ObjectId, userId: String, accountType: String}) => follower.userId === student._id.toString()) > -1;

  return {
    props: {
      student,
      isFollowing,
    },
  };
};
