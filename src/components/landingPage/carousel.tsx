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
          <div id="slide1" className="carousel-item relative w-1/2">
            <TutorCard tutor={tutor} key={tutor._id} />
          </div>,
        )}
        {/* <div id="slide2" className="carousel-item relative w-1/2">
          <TutorCard />
        </div>
        <div id="slide3" className="carousel-item relative w-1/2">
          <TutorCard />
        </div>
        <div id="slide4" className="carousel-item relative w-1/2">
          <TutorCard />
        </div>
        <div id="slide5" className="carousel-item relative w-1/2">
          <TutorCard />
        </div> */}
      </div>
    </>
  );
}
