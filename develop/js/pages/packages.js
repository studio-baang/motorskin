import Swiper from "swiper";
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/swiper.min.css';

class Packages {
    constructor() {
        this.packageSlider = new Swiper('.package-slider', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: true,
            observeSlideChildren: true,
            loop: true,
        });


        this.filterWrapper = document.querySelector('.filter-model');
        this.filterItems = this.filterWrapper.querySelectorAll('.filter-model__item');

        this.filterWrapper.addEventListener('click', this.onClick.bind(this));
    }

    updateActiveClass(target) {
        this.filterItems.forEach(item => {
            item.classList.remove('filter-model__item--active');
        });
        target.classList.add('filter-model__item--active');
    }

    onClick(event) {
        console.log(event.target);
        updateActiveClass(event.target);
    }

    updateSlide() {
        this.packageSlider.update();
    }
}

export default Packages;