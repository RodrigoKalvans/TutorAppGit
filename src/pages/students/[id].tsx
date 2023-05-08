// import Navbar from "@/components/Navbar";
import PostManager from "@/components/posts/PostManager";
import ProfileSection from "@/components/profilePage/ProfileSection";
import Post from "@/models/Post";
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

const StudentPage = ({student, isFollowing, subjects, allSubjects, reviews, posts}: {student: any, isFollowing: boolean, subjects: Array<any>, allSubjects: Array<any>, reviews: Array<any>, posts: Array<any>}) => {
  const {data: session} = useSession();

  if (!student) {
    return (
      <p>No tutor was found!</p>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;

  return (
    <>
      {student && (
        <>
          <Head>
            <title>{fullName}</title>
          </Head>

          <Navbar black={true} />

          <main className="container flex py-2 gap-14">
            <section className="basis-[40rem]">
              <div className="flex flex-col gap-5">
                <ProfileSection user={student} isFollowing={isFollowing} subjects={subjects} session={session} allSubjects={allSubjects} />
                <Activity fullName={fullName} activity={student.activity} />
                <ReviewsSection reviews={reviews} session={session}
                  reviewedUserId={student._id.toString()} reviewedUserRole="student" />

              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-5">
                <span className="font-medium text-xl">Posts</span>
                {session?.user.id === student._id.toString() && (
                  <CreatePostButton />
                )}
              </div>
              <div>
                {posts.length === 0 ? <div className="mt-10 flex justify-center text-xl">This user has not made any posts</div> : <PostManager posts={posts} />}
              </div>
            </section>
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
      $in: student.subjects,
    },
  });

  const allSubjects = await Subject.find();

  // get posts
  const posts = await Post.find({
    _id: {
      $in: student.posts,
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
      allSubjects: JSON.parse(JSON.stringify(allSubjects)),
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
