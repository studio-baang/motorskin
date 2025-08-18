export class ContactButtonDOM {
	constructor({ className, activeClassName }) {
		this.DOM = document.createElement("div");
		this.isActive = false;
		this.className = ["contact-type-button", ...className];
		this.activeClassName = activeClassName;
		this.init();
	}
	init() {
		this.className.forEach((n) => {
			this.DOM.classList.add(n);
		});
	}

	offButtonActive() {
		this.isActive = true;
		this.DOM.classList.add(this.activeClassName);
	}

	offButtonActive() {
		this.isActive = false;
		this.DOM.classList.remove(this.activeClassName);
	}

	render() {
		return this.DOM;
	}
}
