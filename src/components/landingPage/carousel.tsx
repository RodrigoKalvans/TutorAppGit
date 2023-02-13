import TutorCard from "./TutorCard";

export default function Carousel() {
  return (
    <>
      <div className="carousel w-full rounded-box">
        <div id="slide1" className="carousel-item relative w-1/2 flex justify-center">
          <TutorCard />
        </div>
        <div id="slide2" className="carousel-item relative w-1/2">
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
        </div>
      </div>
    </>
  );
}
