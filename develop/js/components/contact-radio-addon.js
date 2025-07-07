export class AddonRadioBtn {
	constructor(labelText, data) {
		this.buttons = [];

		this.figment = document.createDocumentFragment();

		this.labelNode = contactLabelDom(labelText);

		this.wrapper = document.createElement("div");
		this.wrapper.classList.add("contact-option-button-wrapper");

		if (data) {
			data.forEach((element) => {
				this.button = document.createElement("div");
				this.button.classList.add("contact-option-button");
				this.button.dataset.value = element.content;
				this.button.dataset.price = element.price;
				this.button.innerText = element.content;

				this.buttons.push(this.button);
				this.wrapper.appendChild(this.button);
			});
		}

		this.figment.appendChild(this.labelNode);
		this.figment.appendChild(this.wrapper);
	}

	onClickHandler() {
		this.buttons.forEach((button) => {
			button.addEventListener("click", (e) => {
				this.buttons.forEach((allButton) => {
					allButton.classList.remove("contact-option-button--active");
				});

				e.classList.add("contact-option-button--active");
			});
		});
	}

	render() {
		return this.figment;
	}
}
