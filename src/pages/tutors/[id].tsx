import {Session, getServerSession} from "next-auth";

import BoxContainer from "@/components/profilePage/helpingComponents/BoxContainer";
import {GetServerSidePropsContext} from "next";
import Head from "next/head";
import {ObjectId} from "mongoose";
import ProfileSection from "@/components/profilePage/ProfileSection";
import Subject from "@/models/Subject";
import Tutor from "@/models/Tutor";
import {authOptions} from "../api/auth/[...nextauth]";
import db from "@/utils/db";

const TutorPage = ({tutor, isFollowing, subjects}: {tutor: any, isFollowing: boolean, subjects: Array<any>}) => {
  return (
    <>
      {tutor && (
        <>
          <Head>
            <title>{tutor.firstName} {tutor.lastName}</title>
          </Head>

          <main className="w-full h-screen px-28">
            <div className="w-full flex justify-around">

              <ProfileSection user={tutor} isFollowing={isFollowing} subjects={subjects} />

              <div className="w-9/20">
                <BoxContainer >
                  <p>Hello world</p>
                </BoxContainer>
                <BoxContainer >
                  <p>Hello world</p>
                </BoxContainer>

              </div>


            </div>


          </main>

        </>

      )}

      {!tutor && (
        <p>No tutor was found!</p>
      )}
    </>
  );
};

export default TutorPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  await db.connect();
  let tutor = await Tutor.findById(context.query.id);
  tutor = JSON.parse(JSON.stringify(tutor));
  const session: Session | null = await getServerSession(context.req, context.res, authOptions);
  const isFollowing = tutor.followers.findIndex((follower: {_id: ObjectId, userId: String, accountType: String}) => follower.userId === session?.user.id.toString()) > -1;
  const subjects = await Subject.find({
    _id: {
      $in: tutor.subjectsOfSpecialty,
    },
  });

  return {
    props: {
      tutor,
      isFollowing,
      subjects: JSON.parse(JSON.stringify(subjects)),
    },
  };
};
