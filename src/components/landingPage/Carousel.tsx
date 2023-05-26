import "react-responsive-carousel/lib/styles/carousel.min.css";
import {LandingPageCard} from "@/types/ambiguous-types";
import TutorCard from "./TutorCard";
import {Carousel as C} from "react-responsive-carousel";

const interval = 5000; // time between autoplay triggers
const transition = 500; // duration of the slide transition

/**
 * Carousel component
 * @param {Array<any>} carouselItems
 * @param {Array<any>} subjects
 * @return {JSX}
 */
const Carousel = ({
  carouselItems,
  subjects,
} : {
  carouselItems: Array<any>,
  subjects: Array<any>
}) => {
  return (
    <>
      {/* <div className="carousel rounded-box flex gap-10 overflow-y-hidden">
        {carouselItems && carouselItems.map((item: any | LandingPageCard) =>
          <TutorCard card={item} key={item.tutor._id} subjects={subjects}/>,
        )}
      </div> */}
      <div className="flex justify-center">
        <C autoPlay infiniteLoop interval={interval} transitionTime={transition} className="w-[700px] bord">
          {carouselItems && carouselItems.map((item: any | LandingPageCard) =>
            <TutorCard card={item} key={item.tutor._id} subjects={subjects}/>,
          )}
        </C>
      </div>
    </>
  );
};

export default Carousel;
