import BoxContainer from "@/components/profilePage/helpingComponents/BoxContainer";
import ProfileSection from "@/components/profilePage/ProfileSection";
import Review from "@/models/Review";
import Student from "@/models/Student";
import Subject from "@/models/Subject";
import Tutor from "@/models/Tutor";
import db from "@/utils/db";
import {ObjectId} from "mongoose";
import {GetServerSidePropsContext} from "next";
import {getServerSession, Session} from "next-auth";
import Head from "next/head";
import {authOptions} from "../api/auth/[...nextauth]";

const StudentPage = ({student, isFollowing, subjects, reviews}: {student: any, isFollowing: boolean, subjects: Array<any>, reviews: Array<any>}) => {
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

              <ProfileSection user={student} isFollowing={isFollowing} subjects={subjects} ></ProfileSection>

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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  await db.connect();
  let student = await Student.findById(context.query.id);
  student = JSON.parse(JSON.stringify(student));

  // Check if logged in user already follows the student
  const session: Session | null = await getServerSession(context.req, context.res, authOptions);
  const isFollowing = student.followers.findIndex((follower: {_id: ObjectId, userId: String, accountType: String}) => follower.userId === session?.user.id.toString()) > -1;
  // Get subjects
  const subjects = await Subject.find({
    _id: {
      $in: student.subjectsOfSpecialty,
    },
  });

  // Get reviews
  const arr: Array<string> = [];

  for (let i = 0; i < student.reviews.length; i++) {
    arr.push(student.reviews[i].reviewId);
  }

  const reviews = await Review.find({
    _id: {
      $in: arr,
    },
  });

  // Get reviewers
  const newArr = await fetchReviewers(reviews);

  return {
    props: {
      student,
      isFollowing,
      subjects: JSON.parse(JSON.stringify(subjects)),
      reviews: JSON.parse(JSON.stringify(newArr)),
    },
  };
};

const fetchReviewers = async (reviews: Array<any>) => {
  const newArr: any[] = [];

  for (let i: number = 0; i < reviews.length; i++) {
    let reviewerUser;
    const review = reviews[i];
    if (review.reviewerUserRole === "student") {
      const student = await Student.findById(review.reviewerUserId);
      reviewerUser = student;
    } else if (review.reviewerUserRole === "tutor") {
      const tutor = await Tutor.findById(review.reviewerUserId);
      reviewerUser = tutor;
    }

    if (reviewerUser) {
      newArr.push({reviewerUser: reviewerUser, ...review._doc});
    }
  }
  return newArr;
};
