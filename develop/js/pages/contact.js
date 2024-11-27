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
				input.value = input.value.replace(/[^0-9\-]/g, "");

				// 번호 포맷팅
				if (input.length <= 3) {
					// 3자리 이하
					tel.value = input;
				} else if (input.length <= 7) {
					// 3-7자리
					tel.value = input.slice(0, 3) + "-" + input.slice(3);
				} else {
					// 8자리 이상
					tel.value = input.slice(0, 3) + "-" + input.slice(3, 7) + "-" + input.slice(7, 11);
				}
			});
		}
	};
}

export default Contact;
