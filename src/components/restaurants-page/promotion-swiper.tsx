import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import StyledImage from "../styled-image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const arr = [...Array(9).keys()];

export default function PromotionSwiper() {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Autoplay]}
        className="promotion-swiper"
        spaceBetween={20}
        slidesPerView={3}
        slidesPerGroup={1}
        autoplay={{ delay: 2000 }}
        speed={500}
        navigation={{
          nextEl: ".promotion-swiper-button-next",
          prevEl: ".promotion-swiper-button-prev",
        }}
        loop={true}
      >
        {arr.map((item) => (
          <SwiperSlide key={item}>
            <StyledImage
              src={`/assets/images/home/banner-${item + 1}.jpg`}
              alt={`Banner ${item}`}
              wrapperClasses="w-full aspect-[1.78] rounded-lg overflow-hidden"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <i className="icon-arrow-long-right promotion-swiper-button-next">
        <FaArrowRight className="text-white" size={20} />
      </i>
      <i className="icon-arrow-long-left promotion-swiper-button-prev">
        <FaArrowLeft className="text-white" size={20} />
      </i>
    </div>
  );
}
