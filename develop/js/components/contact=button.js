export class ContactButtonDOM {
	constructor({ className, activeClassName }) {
		this.dom = null;
		this.isActive = false;
		this.className = ["contact-type-button", ...className];
		this.activeClassName = activeClassName;
		this.init();
	}
	init() {
		this.dom = document.createElement("div");
		this.className.forEach((n) => {
			this.dom.classList.add(n);
		});
	}

	offButtonActive() {
		this.isActive = true;
		this.dom.classList.add(this.activeClassName);
	}

	offButtonActive() {
		this.isActive = false;
		this.dom.classList.remove(this.activeClassName);
	}

	render() {
		return this.dom;
	}
}
