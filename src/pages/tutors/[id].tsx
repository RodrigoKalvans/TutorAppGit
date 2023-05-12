import Navbar from "@/components/Navbar";
import {Session, getServerSession} from "next-auth";
import {useSession} from "next-auth/react";
import Activity from "@/components/profilePage/Activity";
import {GetServerSidePropsContext} from "next";
import Head from "next/head";
import {ObjectId} from "mongoose";
import ProfileSection from "@/components/profilePage/ProfileSection";
import Review from "@/models/Review";
import ReviewsSection from "@/components/profilePage/ReviewsSection";
import Student from "@/models/Student";
import Subject from "@/models/Subject";
import Tutor from "@/models/Tutor";
import {authOptions} from "../api/auth/[...nextauth]";
import db from "@/utils/db";
import Post from "@/models/Post";
import PostManager from "@/components/posts/PostManager";
import CreatePostButton from "@/components/CreatePostButton";
import Comment from "@/models/Comment";
import Like from "@/models/Like";

const TutorPage = (
    {
      tutor,
      isFollowing,
      subjects,
      reviews,
      allSubjects,
      posts,
      activityArray,
    }: {
      tutor: any,
      isFollowing: boolean,
      subjects: Array<any>,
      reviews: Array<any>,
      allSubjects: Array<any>,
      posts: Array<any>,
      activityArray: Array<any>,
    }) => {
  const {data: session} = useSession();

  if (!tutor) {
    return (
      <p>No tutor was found!</p>
    );
  }

  const fullName = `${tutor.firstName} ${tutor.lastName}`;

  return (
    <>
      {tutor && (
        <>
          <Head>
            <title>{fullName}</title>
          </Head>

          <Navbar black={true} />

          <main className="container flex py-2 gap-14">
            <section className="basis-[40rem]">
              <div className="flex flex-col gap-5">
                <ProfileSection user={tutor} isFollowing={isFollowing}
                  subjects={subjects} session={session} allSubjects={allSubjects} />
                <Activity fullName={fullName} activity={activityArray} />
                <ReviewsSection reviews={reviews} session={session}
                  reviewedUserId={tutor._id.toString()} reviewedUserRole="tutor" />

              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-5">
                <span className="font-medium text-xl">Posts</span>
                {session?.user.id === tutor._id.toString() && (
                  <CreatePostButton />
                )}
              </div>
              <div>
                <PostManager userId={tutor._id.toString()} />
              </div>
            </section>
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

  // Get tutor
  let tutor = await Tutor.findById(context.query.id);
  if (!tutor) {
    return {
      props: {},
    };
  }
  tutor = JSON.parse(JSON.stringify(tutor));

  // Check if logged in user already follows the tutor
  const session: Session | null = await getServerSession(context.req, context.res, authOptions);
  const isFollowing = tutor.followers.findIndex((follower: {_id: ObjectId, userId: String, accountType: String}) => follower.userId === session?.user.id.toString()) > -1;

  // Get subjects (tutor's)
  const subjects = await Subject.find({
    _id: {
      $in: tutor.subjects,
    },
  });

  // get posts
  const posts = await Post.find({
    _id: {
      $in: tutor.posts,
    },
  });

  // Get all subjects
  const allSubjects = await Subject.find();

  const reviews = await Review.find({
    _id: {
      $in: tutor.reviews,
    },
  });

  // Get reviewers
  const newReviewsArr = await fetchReviewers(reviews);

  // Get all related activity
  const activityArray: Array<any> = [];

  await populateActivityArray(tutor.activity, activityArray);

  return {
    props: {
      tutor,
      isFollowing,
      subjects: JSON.parse(JSON.stringify(subjects)),
      allSubjects: JSON.parse(JSON.stringify(allSubjects)),
      reviews: JSON.parse(JSON.stringify(newReviewsArr)),
      posts: JSON.parse(JSON.stringify(posts)),
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
