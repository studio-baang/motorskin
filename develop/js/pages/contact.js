import Swiper from "swiper";
import "swiper/modules/effect-fade.min.css";
import { Autoplay, EffectFade } from "swiper/modules";
import { delay } from "lodash";

class Contact {
	constructor() {
		this.textarea = document.querySelector(".wpcf7-textarea");
		this.modal = document.querySelector(".agreement-modal");
		this.openModalBtn = document.querySelector(".contact-form__open-modal");

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
				if (e.target.classList.contains("agreement-modal")) {
					this.toggleModal();
				}
			});
		}

		new Swiper(".contact-swiper", {
			modules: [Autoplay, EffectFade],
			loop: true,
			effect: "fade",
			fadeEffect: {
				crossFade: true,
			},
			speed: 500,
			autoplay: {
				delay: 2500,
			},
		});
		this.allowPhoneNumber();
	}

	toggleModal = () => {
		if (this.modal) {
			this.modal.classList.toggle("agreement-modal--open");
		}
	};

	handleResizeHeight = () => {
		if (this.textarea) {
			this.textarea.style.height = "auto"; // 초기화
			this.textarea.style.height = `${this.textarea.scrollHeight}px`;
		}
	};

	allowPhoneNumber = () => {
		const tel = document.querySelector("input[name='tel']");
		if (tel) {
			tel.addEventListener("input", function (e) {
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
			});
		}
	};
}

export default Contact;
