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
import {ErrorIcon} from "@/utils/icons";

const TutorPage = (
    {
      tutor,
      isFollowing,
      subjects,
      reviews,
      allSubjects,
      activityArray,
    }: {
      tutor?: any,
      isFollowing: boolean,
      subjects: Array<any>,
      reviews: Array<any>,
      allSubjects: Array<any>,
      activityArray: Array<any>,
    }) => {
  const {data: session} = useSession();

  if (!tutor) {
    return (
      <>
        <Head>
          <title>Not Found</title>
        </Head>
        <Navbar black={true} />

        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <ErrorIcon size={50} fill="red"/>
            <p className="text-red-600 text-lg">No tutor was found!</p>
          </div>
        </main>
      </>
    );
  }

  const fullName = `${tutor.firstName} ${tutor.lastName}`;
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
            <ProfileSection user={tutor} isFollowing={isFollowing}
              subjects={subjects} session={session} />
            <Activity fullName={fullName} activity={activityArray} />
            <ReviewsSection reviews={reviews} session={session}
              reviewedUserId={tutor._id.toString()} reviewedUserRole="tutor" />

          </div>
        </section>

        <section className="w-full">
          <div className="flex justify-between items-center mb-5">
            <span className="font-medium text-xl">Posts</span>
            {session?.user.id === tutor._id.toString() && (
              <CreatePostButton />
            )}
          </div>

          <PostManager userId={tutor._id.toString()} />
        </section>
      </main>

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
  const isFollowing: boolean = tutor.followers.findIndex((follower: {_id: ObjectId, userId: String, role: String}) => follower.userId === session?.user.id.toString()) > -1;

  // Get subjects (tutor's)
  const subjects = await Subject.find({
    _id: {
      $in: tutor.subjects,
    },
  });

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
      reviews: JSON.parse(JSON.stringify(newReviewsArr)),
      activityArray: JSON.parse(JSON.stringify(activityArray)),
    },
  };
};

const fetchReviewers = async (reviews: Array<any>) => {
  const newArr: any[] = [];

  for (let i: number = 0; i < reviews.length; i++) {
    let user;
    const review = reviews[i];
    if (review.reviewerUserRole === "student") {
      user = await Student.findById(review.reviewerUserId);
    } else if (review.reviewerUserRole === "tutor") {
      user = await Tutor.findById(review.reviewerUserId);
    }

    if (!user) continue;

    const reviewerUser: {
      _id: string,
      role: string,
      firstName: string,
      lastName: string,
      picture?: string,
    } = {
      _id: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    if (user.picture) reviewerUser.picture = user.picture;

    if (reviewerUser) {
      newArr.push({
        reviewerUser,
        ...review._doc,
      });
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
    let targetUser: {
      id: string,
      role: string,
    };

    switch (reference.activityType) {
      case "comment": {
        activity = await Comment.findById(reference.activityId);
        action = "commented on post";
        const post = await Post.findById(activity.postId);
        targetUser = {
          id: post.userId,
          role: post.role,
        };
        break;
      }

      case "like": {
        activity = await Like.findById(reference.activityId);
        action = "liked post";
        const post = await Post.findById(activity.postId);
        targetUser = {
          id: post.userId,
          role: post.role,
        };
        break;
      }

      case "review": {
        activity = await Review.findById(reference.activityId);
        action = "reviewed a user";
        targetUser = {
          id: activity.reviewedUserId,
          role: activity.reviewedUserRole,
        };
        break;
      }
      default:
        return;
    }

    activityArray.push({activityType: reference.activityType, action, activity, targetUser});
  }
};
