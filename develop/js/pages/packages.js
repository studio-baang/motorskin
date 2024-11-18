import Swiper from "swiper";
import { Navigation, Pagination } from 'swiper/modules';

class Packages {
    constructor() {
        const packageSlider = new Swiper('package-slider', {
            slidesPerView: 3.5,
            spaceBetween: 30,
            centeredSlides: true,
            observeSlideChildren: true,
            loop: true,
        })
    }
}

export default Packages;