import Swiper from "swiper";
import "swiper/modules/effect-fade.min.css";
import { Autoplay, EffectFade } from "swiper/modules";
import _ from "lodash";
import { checkSiteName } from "../utils/filter-site-by-name";
import { BimmerReceipt } from "../blocks/bimmer-receipt";
import { panameraReceipt } from "../blocks/panamera-receipt";
import { PorcsheReceipt } from "../blocks/porsche-receipt";

class Contact {
	constructor(isDealer) {
		this.isDealerCustomPage = isDealer || false;

		this.form = document.querySelector(".wpcf7-form");

		this.textarea = document.querySelector(".wpcf7-textarea");
		this.modal = document.querySelector(".agreement-modal");
		this.openModalBtn = document.querySelector(".contact-form__open-modal");
		this.tel = document.querySelector("input[name='tel']");

		this.init();
	}

	init() {
		if (this.textarea) {
			this.textarea.addEventListener("input", this.handleResizeHeight);
		}

		if (this.openModalBtn) {
			this.openModalBtn.addEventListener("click", this.toggleModal);
		}

		if (this.modal) {
			this.modal.addEventListener("click", (e) => {
				this.toggleModal();
			});
		}

		if (this.tel) {
			this.tel.addEventListener("input", _.debounce(this.allowPhoneNumber.bind(this), 17));
		}

		new Swiper(".contact-swiper", {
			modules: [Autoplay, EffectFade],
			loop: true,
			effect: "fade",
			speed: 750,
			autoplay: {
				delay: 2500,
			},
		});

		if (checkSiteName("bimmer")) {
			new BimmerReceipt();
		}
		if (checkSiteName("panamera")) {
			new panameraReceipt();
		}
		if (checkSiteName("porsche")) {
			// 포르쉐 일반 contact 페이지
			new PorcsheReceipt();
		}
	}

	toggleModal = () => {
		this.modal.classList.toggle("agreement-modal--open");
	};

	handleResizeHeight = () => {
		if (this.textarea) {
			this.textarea.style.height = "auto"; // 초기화
			this.textarea.style.height = `${this.textarea.scrollHeight}px`;
		}
	};

	allowPhoneNumber(e) {
		const input = e.target;
		const filterInput = input.value.replace(/\D/g, "");

		// 번호 포맷팅
		if (filterInput.length <= 3) {
			// 3자리 이하
			input.value = filterInput;
		} else if (filterInput.length <= 7) {
			// 3-7자리
			input.value = filterInput.slice(0, 3) + "-" + filterInput.slice(3);
		} else {
			// 8자리 이상
			input.value = filterInput.slice(0, 3) + "-" + filterInput.slice(3, 7) + "-" + filterInput.slice(7, 11);
		}
	}
}

export default Contact;
