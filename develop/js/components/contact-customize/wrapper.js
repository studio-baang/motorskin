import { contactLabelDOM } from "../contact-form-label";

export class Wrapper {
	constructor({ labelText = false, className = [] } = false) {
		this.DOM = document.createElement("div");
		this.className = ["contact-form__input-wrapper", ...className];

		this.hasLabel = false;
		this.labelDOM = false;

		this.className.forEach((e) => {
			this.DOM.classList.add(e);
		});

		if (labelText) {
			this.hasLabel = true;
			this.labelDOM = contactLabelDOM(labelText);
		}
	}

	update(chideNode) {
		this.DOM.innerHTML = "";
		if (chideNode) {
			if (this.hasLabel) {
				this.DOM.appendChild(this.labelDOM);
			}
			this.DOM.appendChild(chideNode);
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
