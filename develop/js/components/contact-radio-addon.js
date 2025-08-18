import { contactLabelDOM } from "./contact-form-label";

export class AddonRadioBtn {
	constructor(labelText, data) {
		this.buttons = [];

		this.figment = document.createDocumentFragment();

		this.labelNode = contactLabelDOM(labelText);

		this.wrapper = document.createElement("div");
		this.wrapper.classList.add("contact-option-button-wrapper");

		if (data) {
			data.forEach((element, index) => {
				this.button = document.createElement("div");
				this.button.classList.add("contact-option-button");
				this.button.dataset.value = element.title;
				this.button.innerText = element.title;

				if (index == 0) {
					this.button.classList.add("contact-option-button--active");
				}

				this.buttons.push(this.button);
				this.wrapper.appendChild(this.button);
			});
		}

		this.figment.appendChild(this.labelNode);
		this.figment.appendChild(this.wrapper);
	}

	render() {
		return this.figment;
	}
}
