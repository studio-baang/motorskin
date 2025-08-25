export class SelectWrapper {
	constructor({ update = false, onClick = false }) {
		this.DOM = document.createDocumentFragment();
		this.updateFn = update;
		this.onClick = onClick;
		this.handleClick = this.handleClickFn.bind(this);

		this.selectDOM = document.createElement("select");
		this.selectDOM.classList.add("wpcf7-select");
	}

	createItem() {
		if (this.data && this.data.length > 1) {
			this.data.forEach((element) => {
				const optionContent = element.description ?? element.title;
				const option = new Option(optionContent);
				this.selectDOM.appendChild(option);
			});
			// set selected Index
			this.selectDOM.selectedIndex = 0;

			if (this.updateFn) {
				this.updateFn(this.selectDOM.value, this.data[0].price);
			}
			this.selectDOM.addEventListener("input", this.handleClick);
			this.DOM.appendChild(this.selectDOM);
		} else {
			if (this.updateFn) {
				this.updateFn(this.data[0].title, this.data[0].price);
			}
			this.DOM.innerHTML = "";
		}
	}

	render() {
		return this.DOM;
	}

	handleClickFn() {
		const selectedIndex = this.selectDOM.selectedIndex;
		if (this.updateFn) {
			this.updateFn(this.data[selectedIndex].title, this.data[selectedIndex].price);
		}
		if (this.onClick) {
			this.onClick(this.selectDOM.value);
		}
	}

	removeItem() {
		this.DOM = document.createDocumentFragment();
		this.selectDOM.innerHTML = "";
		this.selectDOM.removeEventListener("input", this.handleClick);
	}

	update(data) {
		this.data = data;
		this.removeItem();
		this.createItem();
	}
}
