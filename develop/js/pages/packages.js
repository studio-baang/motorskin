import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/swiper.min.css";
import { isSiteBimmer, isSitePanamera } from "../utils/filter-site-by-name";

class PackageSwiper {
	constructor() {
		this.PackageSliderDom = document.querySelector(".package-slider") ?? false;
		this.packageSlider = {};
	}

	createSwiper() {
		this.packageSlider = new Swiper(".package-slider", {
			modules: [Autoplay],
			slidesPerView: "auto",
			spaceBetween: 16,
			slidesOffsetBefore: 16,
			slidesOffsetAfter: 16,
			observeSlideChildren: true,
			centeredSlides: true,
			centeredSlidesBounds: true,
			touchRatio: 0.3,
			autoplay: {
				delay: 2500,
				pauseOnMouseEnter: true,
			},
			breakpoints: {
				658: {
					spaceBetween: 32,
					slidesOffsetBefore: 32,
					slidesOffsetAfter: 32,
				},
			},
		});
		this.packageSlider.slideTo(11);
	}
}

class BimmerPackages extends PackageSwiper {
	constructor() {
		super();
		this.filterWrapper = document.querySelector(".filter-model") ?? false;
		this.filterItems = [];
		this.filterActiveItemName = "";
		if (this.filterWrapper) {
			this.filterItems = this.filterWrapper.querySelectorAll(".filter-model__item");
			this.filterActiveItemName = "filter-model__item--active";
			this.filterWrapper.addEventListener("click", this.onClick.bind(this));
		}
	}

	updateActiveClass(target) {
		this.filterItems.forEach((item) => {
			item.classList.remove(this.filterActiveItemName);
		});
		target.classList.add(this.filterActiveItemName);
	}

	updateSlide(data) {
		const cards = document.querySelectorAll(".package-card");
		const activeCardClassName = "package-card--inactive";

		cards.forEach((card) => {
			const modelDataArr = card.dataset.model.split(", ");
			card.classList.add(activeCardClassName);
			modelDataArr.forEach((e) => {
				if (e === data || data === "all") {
					card.classList.remove(activeCardClassName);
				}
			});
		});

		this.packageSlider.updateSlides();
		this.packageSlider.slideTo(1);
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

class PanameraPackages extends PackageSwiper {
	createSwiper() {
		this.packageSlider = new Swiper(".package-slider", {
			modules: [Autoplay],
			slidesPerView: "auto",
			spaceBetween: 16,
			slidesOffsetBefore: 16,
			slidesOffsetAfter: 16,
			observeSlideChildren: true,
			centeredSlides: true,
			centeredSlidesBounds: true,
			touchRatio: 0.3,
			loop: true,
			autoplay: {
				delay: 2500,
				pauseOnMouseEnter: true,
			},
			breakpoints: {
				658: {
					spaceBetween: 32,
					slidesOffsetBefore: 32,
					slidesOffsetAfter: 32,
				},
			},
		});
	}
}

export function packagesInit() {
	let activePackges;
	if (isSiteBimmer()) {
		activePackges = new BimmerPackages();
	} else if (isSitePanamera()) {
		activePackges = new PanameraPackages();
	}

	document.addEventListener("DOMContentLoaded", () => {
		if (activePackges.PackageSliderDom) {
			activePackges.createSwiper();
		}
	});
}
