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
import {useLoading} from "@/utils/hooks";
import BoxContainer from "@/components/profilePage/helpingComponents/BoxContainer";
import dynamic from "next/dynamic";

const ContentLoader = dynamic(import("react-content-loader"), {
  ssr: false,
});

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
      tutor?: any,
      isFollowing: boolean,
      subjects: Array<any>,
      reviews: Array<any>,
      allSubjects: Array<any>,
      posts: Array<any>,
      activityArray: Array<any>,
    }) => {
  const isLoading = useLoading();
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

  return (
    <>

      <Head>
        <title>{fullName}</title>
      </Head>

      <Navbar black={true} />

      {!isLoading ? (
        <main className="container flex flex-col lg:flex-row py-2 gap-14 min-h-[calc(100vh-64px)]">
          <section className="w-full">
            <div className="flex flex-col gap-5">
              <ProfileSection user={tutor} isFollowing={isFollowing}
                subjects={subjects} session={session} allSubjects={allSubjects} />
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
        ) : (
          <main className="container py-2 min-h-screen">
            <BoxContainer style="hidden lg:w-2/5">
              {/* <MyLoader /> */}
              <ContentLoader
                speed={2}
                width={1100}
                height={500}
                viewBox="0 0 400 160"
                backgroundColor="#ededed"
                foregroundColor="#dbdbdb"
              >
                <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
                <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
                <circle cx="22" cy="22" r="20" />
                <rect x="158" y="136" rx="0" ry="0" width="3" height="0" />
                <rect x="4" y="64" rx="3" ry="3" width="35" height="11" />
                <rect x="4" y="94" rx="3" ry="3" width="43" height="5" />
                <rect x="4" y="83" rx="3" ry="3" width="43" height="5" />
                <rect x="6" y="114" rx="3" ry="3" width="35" height="11" />
                <rect x="6" y="144" rx="3" ry="3" width="43" height="5" />
                <rect x="6" y="133" rx="3" ry="3" width="43" height="5" />
                <rect x="77" y="64" rx="3" ry="3" width="35" height="11" />
                <rect x="77" y="94" rx="3" ry="3" width="43" height="5" />
                <rect x="77" y="83" rx="3" ry="3" width="43" height="5" />
                <rect x="76" y="114" rx="3" ry="3" width="35" height="11" />
                <rect x="76" y="144" rx="3" ry="3" width="43" height="5" />
                <rect x="76" y="133" rx="3" ry="3" width="43" height="5" />
              </ContentLoader>
            </BoxContainer>

            <BoxContainer style="w-full lg:hidden">
              {/* <MyLoader /> */}
              <ContentLoader
                speed={2}
                width={250}
                height={400}
                viewBox="0 0 250 400"
                backgroundColor="#ededed"
                foregroundColor="#dbdbdb"
              >
                <rect x="108" y="47" rx="3" ry="3" width="129" height="9" />
                <rect x="108" y="73" rx="3" ry="3" width="77" height="9" />
                <rect x="123" y="187" rx="0" ry="0" width="2" height="0" />
                <rect x="11" y="141" rx="3" ry="3" width="60" height="19" />
                <rect x="11" y="193" rx="3" ry="3" width="74" height="9" />
                <rect x="11" y="174" rx="3" ry="3" width="74" height="9" />
                <rect x="15" y="227" rx="3" ry="3" width="60" height="19" />
                <rect x="15" y="279" rx="3" ry="3" width="74" height="9" />
                <rect x="15" y="260" rx="3" ry="3" width="74" height="9" />
                <rect x="137" y="141" rx="3" ry="3" width="60" height="19" />
                <rect x="137" y="193" rx="3" ry="3" width="74" height="9" />
                <rect x="137" y="174" rx="3" ry="3" width="74" height="9" />
                <rect x="135" y="227" rx="3" ry="3" width="60" height="19" />
                <rect x="135" y="279" rx="3" ry="3" width="74" height="9" />
                <rect x="135" y="260" rx="3" ry="3" width="74" height="9" />
                <circle cx="46" cy="66" r="44" />
              </ContentLoader>
            </BoxContainer>
          </main>
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
  const isFollowing = tutor.followers.findIndex((follower: {_id: ObjectId, userId: String, role: String}) => follower.userId === session?.user.id.toString()) > -1;

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
