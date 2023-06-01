import {LandingPageCard} from "@/types/ambiguous-types";
import TutorCard from "./TutorCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  autoplay: false,
  autoplaySpeed: 3000,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerPadding: undefined,
      },
    },
  ],
};

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
    <Slider {...settings}>
      {carouselItems && carouselItems.map((item: any | LandingPageCard) =>
        <TutorCard card={item} key={item.tutor._id} subjects={subjects}/>,
      )}
    </Slider>
  );
};

export default Carousel;
