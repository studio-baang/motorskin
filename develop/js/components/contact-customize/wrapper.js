import { contactLabelDOM } from "../contact-form-label";

export class Wrapper {
	constructor({ labelText, className = [] }) {
		this.DOM = document.createElement("div");
		this.className = ["contact-form__input-wrapper", ...className];

		this.hasLabel = false;
		this.labelDOM = false;

		this.updateFn = update;
		this.onClickFn = onClick;

		this.className.forEach((e) => {
			this.DOM.classList.add(e);
		});

		if (labelText) {
			this.hasLabel = true;
			this.labelDOM = contactLabelDOM(labelText);
		}
	}

	appendTo(parentNode) {
		parentNode.appendChild(this.render());
	}

	refresh() {
		this.DOM.innerHTML = "";
	}

	render() {
		return this.DOM;
	}
}
