import { contactLabelDom } from "./contact-form-label";

export class AddonRadioBtn {
	constructor(labelText, data) {
		this.buttons = [];

		this.figment = document.createDocumentFragment();

		this.labelNode = contactLabelDom(labelText);

		this.wrapper = document.createElement("div");
		this.wrapper.classList.add("contact-option-button-wrapper");

		if (data) {
			data.forEach((element, index) => {
				let content = element.value;
				// 추가 금액이 있을 시 옵션에 추가
				if (element.price !== 0) {
					content += " (";
					if (element.price > 0) {
						content += "+";
					} else {
						content += "-";
					}
					content += element.price.toLocaleString("ko-KR");
					content += "원)";
				}

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
