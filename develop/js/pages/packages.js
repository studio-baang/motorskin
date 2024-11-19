import Swiper from "swiper";
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/swiper.min.css';

class Packages {
    constructor() {
        const packageSlider = new Swiper('.package-slider', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: true,
            observeSlideChildren: true,
            loop: true,
        })
    }
}

export default Packages;