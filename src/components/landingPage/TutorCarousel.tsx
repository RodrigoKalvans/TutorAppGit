import TutorCard from "./TutorCard";

/**
 * Appears on landing page
 * @param {Array<any>} tutors
 * @return {JSX}
 */
export default function Carousel({tutors}: {tutors: Array<any>}) {
  return (
    <>
      <div className="carousel w-full rounded-box">
        {tutors && tutors.map((tutor) =>
          <div className="carousel-item relative w-1/2">
            <TutorCard tutor={tutor} key={tutor._id} />
          </div>,
        )}
      </div>
    </>
  );
}
