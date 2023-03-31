// import Navbar from "@/components/Navbar";

import {Session, getServerSession} from "next-auth";

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

const TutorPage = ({tutor, isFollowing, subjects, reviews, posts}: {tutor: any, isFollowing: boolean, subjects: Array<any>, reviews: Array<any>, posts: Array<any>}) => {
  const fullName = `${tutor.firstName} ${tutor.lastName}`;

  return (
    <>
      {tutor && (
        <>
          <Head>
            <title>{fullName}</title>
          </Head>

          {/* <Navbar black={true} /> */}

          <main className="w-full px-28">
            <section className="m-2">
              <div className="w-full h-max flex justify-around">

                <div className="w-9/20 h-max">
                  <ProfileSection user={tutor} isFollowing={isFollowing} subjects={subjects} />
                </div>

                <div className="w-9/20 flex flex-col">

                  <Activity fullName={fullName} activity={tutor.activity} />
                  <ReviewsSection reviews={reviews} />

                </div>

              </div>
            </section>

            <section className="m-2 p-3 mt-10">
              <div className="w-full h-10 flex justify-between items-center px-24">
                <div className="uppercase font-bold text-xl">posts</div>
                <div className="btn ">button</div>
              </div>
              <div>
                {posts.length === 0 ? <div className="m-5 mt-10 flex justify-center text-xl">This user has not made any posts</div> : <PostManager posts={posts} />}
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
  tutor = JSON.parse(JSON.stringify(tutor));

  // Check if logged in user already follows the tutor
  const session: Session | null = await getServerSession(context.req, context.res, authOptions);
  const isFollowing = tutor.followers.findIndex((follower: {_id: ObjectId, userId: String, accountType: String}) => follower.userId === session?.user.id.toString()) > -1;

  // Get subjects
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

  // Get reviews
  const arr: Array<string> = [];

  for (let i = 0; i < tutor.reviews.length; i++) {
    arr.push(tutor.reviews[i].reviewId);
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
      tutor,
      isFollowing,
      subjects: JSON.parse(JSON.stringify(subjects)),
      reviews: JSON.parse(JSON.stringify(newArr)),
      posts: JSON.parse(JSON.stringify(posts)),
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
