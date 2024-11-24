import Swiper from "swiper";
import { Navigation, Autoplay, Mousewheel } from "swiper/modules";

import "swiper/swiper.min.css";

class Packages {
	constructor() {
		this.packageSlider = new Swiper(".package-slider", {
			modules: [Autoplay, Mousewheel],
			slidesPerView: "auto",
			spaceBetween: 30,
			observeSlideChildren: true,
			centeredSlides: true,
			autoplay: {
				delay: 5000,
				pauseOnMouseEnter: true,
			},
			mousewheel: {
				enabled: true,
			},
		});
		this.packageSlider.slideTo(11);

		this.filterWrapper = document.querySelector(".filter-model");
		this.filterItems = this.filterWrapper.querySelectorAll(".filter-model__item");
		this.filterActiveItemName = "filter-model__item--active";

		this.filterWrapper.addEventListener("click", this.onClick.bind(this));
	}

	updateActiveClass(target) {
		this.filterItems.forEach((item) => {
			item.classList.remove(this.filterActiveItemName);
		});
		target.classList.add(this.filterActiveItemName);
	}

	updateSlide(data) {
		const cards = document.querySelectorAll(".package-slider__card");

		cards.forEach((card) => {
			const modelDataArr = card.dataset.model.split(", ");
			card.classList.add("package-slider__card--inactive");

			console.log(modelDataArr);
			modelDataArr.forEach((e) => {
				if (e === data || data === "all") {
					card.classList.remove("package-slider__card--inactive");
				}
			});
		});

		this.packageSlider.updateSlides();
		this.packageSlider.slideTo(1);
		this.packageSlider.start();
	}
	onClick(e) {
		const target = e.target;
		if (!target.classList.contains(this.filterActiveItemName) && target.dataset.filterName) {
			const data = target.dataset.filterName;

			this.updateSlide(data);
			this.updateActiveClass(e.target);
		}
	}
}

export default Packages;
