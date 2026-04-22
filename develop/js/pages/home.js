import Swiper from "swiper";
import "swiper/swiper.min.css";
import { Pagination, Autoplay, Controller, Thumbs } from "swiper/modules";
import { debounce } from "lodash";
import { ServiceList } from "../blocks/serviceList";

import { checkSiteName } from "../utils/filter-site-by-name";
import { ContactForm } from "../blocks/contact-form";

const homeSlider = document.querySelector(".home-slider");

export class Home {
	constructor() {
		this.hasSlider = document.hasChildNodes(homeSlider);

		this.onLoad();
	}

	onLoad() {
		this.setServiceListAnim();
		if (this.hasSlider) {
			new homeSlide();
		}
		if (checkSiteName("motorskin")) {
			new ContactForm();
		}
	}

	setSlider() {}

	setServiceListAnim() {
		const listItems = document.querySelectorAll(".service-list__item");

		const listAnimArr = [];

		if (listItems) {
			for (let i = 0; i < listItems.length; i++) {
				const listItem = listItems[i];
				const anim = new ServiceList(listItem);
				anim.resizeFunc();
				listAnimArr.push(anim);

				listItem.addEventListener("click", (e) => {
					const targetItem = listAnimArr.find((item) => item.el === e.currentTarget);
					const currentItem = listAnimArr.find((item) => item.isActive === true);

					listAnimArr.forEach((item) => (item.isActive = false));

					// 이전의 active 요소와 현재 active 요소가 같지 않다면 isActive를 활성화한다.
					if (targetItem !== currentItem) {
						targetItem.isActive = true;
					}

					// onClick 함수를 실행한다.
					listAnimArr.forEach((item) => item.onClick());
				});
			}

			window.addEventListener(
				"resize",
				debounce(() => {
					listAnimArr.forEach((item) => item.onResize());
				}, 150),
			);
		}
	}
}

class homeSlide {
	constructor() {
		this.init();
	}

	init() {
		const slides = homeSlider.querySelectorAll(".swiper-slide");
		const bulletContents = [];
		slides.forEach((e) => {
			bulletContents.push(e.querySelector(".ct-headline").innerText);
		});
		const paginationSlider = document.querySelector(".home-slider-pagination");
		const paginaionWrapper = paginationSlider.querySelector(".swiper-wrapper");
		bulletContents.forEach((content, index) => {
			const dom = document.createElement("div");

			dom.classList.add("swiper-slide");
			dom.innerHTML = `<span class="home-slider-pagination__content">${bulletContents[index]}</span>`;
			paginaionWrapper.appendChild(dom);
		});

		const thumbSwiper = new Swiper(paginationSlider, {
			modules: [Thumbs],
			slideToClickedSlide: true,
			slidesPerView: "auto",
			centerInsufficientSlides: true,
			watchOverflow: false,
			breakpoints: {
				800: {
					grabCursor: false,
				},
			},
		});

		const mainSwiper = new Swiper(homeSlider, {
			modules: [Autoplay, Thumbs],
			autoplay: {
				delay: 4000,
				disableOnInteraction: false,
			},
			thumbs: {
				swiper: thumbSwiper,
			},
		});

		const handleResize = () => {
			thumbSwiper.update();
			mainSwiper.update();
		};

		window.addEventListener("resize", debounce(handleResize, 150));
	}
}
