import Swiper from "swiper";
import "swiper/swiper.min.css";
import { Pagination, Autoplay } from "swiper/modules";
import { debounce } from "lodash";
import { ServiceList } from "../blocks/serviceList";

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
		const bulletContent = [];
		slides.forEach((e) => {
			bulletContent.push(e.querySelector(".ct-headline").innerText);
		});

		new Swiper(homeSlider, {
			modules: [Pagination, Autoplay],
			autoplay: {
				delay: 4000,
				disableOnInteraction: false,
			},
			pagination: {
				el: ".home-slider-pagination",
				clickable: true,
				renderBullet: function (index, className) {
					return '<span class="' + className + '"><span class="home-slider-pagination__content">' + bulletContent[index] + "</span></span>";
				},
			},
		});
	}
}
