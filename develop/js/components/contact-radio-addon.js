import { contactLabelDom } from "./contact-form-label";
import { createAddonContent } from "../utils/create-addon-content";

export class AddonRadioBtn {
	constructor(labelText, data) {
		this.buttons = [];

		this.figment = document.createDocumentFragment();

		this.labelNode = contactLabelDom(labelText);

		this.wrapper = document.createElement("div");
		this.wrapper.classList.add("contact-option-button-wrapper");

		if (data) {
			data.forEach((element, index) => {
				const content = createAddonContent(element.value, element.price);

				this.button = document.createElement("div");
				this.button.classList.add("contact-option-button");
				this.button.dataset.value = element.value;
				this.button.innerText = content;

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
