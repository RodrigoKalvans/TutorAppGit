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

          {/* <Navbar black={true} /> */}
          <main className="w-full h-screen px-28">
            <div className="w-full flex justify-around m-2">

              <div className="w-9/20 h-max">
                <ProfileSection user={student} isFollowing={isFollowing} subjects={subjects} allSubjects={allSubjects} session={session} />
              </div>

              <div className="w-9/20 flex flex-col">

                <Activity fullName={fullName} activity={student.activity} />
                <ReviewsSection reviews={reviews} />

              </div>

            </div>

            <section className="m-2 p-3 mt-10">
              <div className="w-full h-10 flex justify-between items-center px-24">
                <div className="uppercase font-bold text-xl">posts</div>
                {session?.user.id === student._id.toString() && (
                  <CreatePostButton />
                )}
              </div>
              <div>
                {posts.length === 0 ? <div className="m-5 mt-10 flex justify-center text-xl">This user has not made any posts</div> : <PostManager posts={posts} />}
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
  // const subjects = await Subject.find({
  //   _id: {
  //     $in: student.subjectsOfSpecialty,
  //   },
  // });
  const studentSubjects = [];

  const allSubjects = await Subject.find();

  for (let i = 0; i < allSubjects.length; i++) {
    if (allSubjects.findIndex((subject: any) => subject._id.toString() === allSubjects[i]._id.toString()) > -1) {
      studentSubjects.push(allSubjects[i]);
    }
  }

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
      subjects: JSON.parse(JSON.stringify(studentSubjects)),
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
