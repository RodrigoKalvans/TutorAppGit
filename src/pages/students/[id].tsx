import PostManager from "@/components/posts/PostManager";
import ProfileSection from "@/components/profilePage/ProfileSection";
import Comment from "@/models/Comment";
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
import {useSession} from "next-auth/react";
import ReviewsSection from "@/components/profilePage/ReviewsSection";
import Activity from "@/components/profilePage/Activity";
import CreatePostButton from "@/components/CreatePostButton";
import Navbar from "@/components/Navbar";
import Like from "@/models/Like";
import {ErrorIcon} from "@/utils/icons";

const StudentPage = (
    {
      student,
      isFollowing,
      subjects,
      reviews,
      activityArray,
    }: {
    student: any,
    isFollowing: boolean,
    subjects: Array<any>,
    reviews: Array<any>,
    activityArray: Array<any>,
  }) => {
  const {data: session} = useSession();

  if (!student) {
    return (
      <>
        <Head>
          <title>Not Found</title>
        </Head>
        <Navbar black={true} />

        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <ErrorIcon size={50} fill="red"/>
            <p className="text-red-600 text-lg">No student was found!</p>
          </div>
        </main>
      </>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const title = `TCorvus | ${fullName}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Navbar black={true} />

      <main className="2xl:container flex flex-col lg:flex-row py-2 px-2 md:px-5 lg:px-10 gap-10 xl:gap-14 min-h-[calc(100vh-64px)]">
        <section className="w-full">
          <div className="flex flex-col gap-5">
            <ProfileSection user={student} isFollowing={isFollowing} subjects={subjects} session={session} />
            <Activity fullName={fullName} activity={activityArray} />
            <ReviewsSection reviews={reviews} session={session}
              reviewedUserId={student._id.toString()} reviewedUserRole="student" />

          </div>
        </section>

        <section className="w-full">
          <div className="flex justify-between items-center mb-5">
            <span className="font-medium text-xl">Posts</span>
            {session?.user.id === student._id.toString() && (
              <CreatePostButton />
            )}
          </div>
          <div>
            <PostManager userId={student._id.toString()} />
          </div>
        </section>
      </main>
    </>
  );
};

export default StudentPage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  await db.connect();
  let student = await Student.findById(context.query.id);
  if (!student) {
    return {
      props: {},
    };
  }
  student = JSON.parse(JSON.stringify(student));

  // Check if logged in user already follows the student
  const session: Session | null = await getServerSession(context.req, context.res, authOptions);
  const isFollowing: boolean = student.followers.findIndex((follower: {_id: ObjectId, userId: String, role: String}) => follower.userId === session?.user.id.toString()) > -1;
  // Get subjects
  const subjects = await Subject.find({
    _id: {
      $in: student.subjects,
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

  // Get all related activity
  const activityArray: Array<any> = [];

  await populateActivityArray(student.activity, activityArray);

  return {
    props: {
      student,
      isFollowing,
      subjects: JSON.parse(JSON.stringify(subjects)),
      reviews: JSON.parse(JSON.stringify(newArr)),
      activityArray: JSON.parse(JSON.stringify(activityArray)),
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

const populateActivityArray = async (
    activities: Array<{
    activityId: string,
    activityType: string
  }>,
    activityArray: Array<any>) => {
  for (let i = activities.length - 1; i >= 0; i--) {
    const reference = activities[i];
    let activity;
    let action: string;

    switch (reference.activityType) {
      case "comment":
        activity = await Comment.findById(reference.activityId);
        action = "commented on post";
        break;

      case "like":
        activity = await Like.findById(reference.activityId);
        action = "liked post";
        break;

      case "review":
        activity = await Review.findById(reference.activityId);
        action = "reviewed a user";
        break;

      default:
        return;
    }

    activityArray.push({activityType: reference.activityType, action, activity});
  }
};
