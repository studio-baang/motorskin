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
		document.addEventListener("input", function (e) {
			const input = e.target;
			if (input.name === "tel") {
				input.value = input.value.replace(/[^0-9\-]/g, "");
			}
		});
	};
}

export default Contact;
