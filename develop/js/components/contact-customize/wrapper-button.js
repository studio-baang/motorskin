import { AddonButtonDOM, PackageButtonDOM, TypeButtonDOM } from "./package-button";

class ButtonWrapper {
	constructor({ className, labelText, buttonContentArray, update = false, onClick = false }) {
		super({ className, labelText });

		this.buttonContainerDOM = document.createDocumentFragment();

		if (className) {
			this.buttonContainerDOM = document.createElement("div");
			if (Array.isArray(className)) {
				className.forEach((e) => {
					this.buttonContainerDOM.classList.add(e);
				});
				return false;
			}
			this.buttonContainerDOM.classList.add(className);
		}

		this.buttonArray = [];
		this.buttonContentArray = buttonContentArray;

		this.handleClick = this.handleClickFn.bind(this);
		this.updateFn = update;
		this.onClickFn = onClick;
	}

	update(data) {
		this.data = data;
		this.removeItem();
		this.createItem();
	}

	handleClickFn(e) {
		this.buttonArray.forEach((el) => el.offButtonActive());
		const clickedBtn = this.buttonArray.find((btn) => btn.DOM === e.currentTarget);
		if (this.updateFn) {
			clickedBtn.update(this.updateFn);
		}
		if (clickedBtn) {
			clickedBtn.onClick(this.onClickFn);
		}
	}

	removeItem() {
		// 리스너 해제
		this.buttonArray.forEach((btn) => {
			btn.DOM.removeEventListener("click", this.handleClick);
		});

		// DOM 제거
		this.buttonContainerDOM = document.createDocumentFragment();

		// 참조 제거
		this.buttonArray = [];
	}

	createItem() {
		this.buttonArray.forEach((e, i) => {
			if (i == 0) {
				e.onButtonActive();
				if (this.updateFn) {
					e.update(this.updateFn);
				}
			}
			e.DOM.addEventListener("click", this.handleClick);
			this.buttonContainerDOM.appendChild(e.DOM);
		});

		this.DOM.appendChild(this.buttonContainerDOM);
	}
}

export class PackageButtonWrapper extends ButtonWrapper {
	constructor({ className, buttonContentArray, update = false, onClick = false }) {
		super({ className, buttonContentArray, update, onClick });
	}

	createItem() {
		this.buttonContentArray.forEach((button) => {
			const btn = new PackageButtonDOM(button);
			this.buttonArray.push(btn);
		});
		super.createItem();
	}
}

export class TypeButtonWrapper extends ButtonWrapper {
	constructor({ className, labelText, buttonContentArray, update = false, onClick = false } = {}) {
		super({ className, labelText, buttonContentArray, update, onClick });
	}

	createItem() {
		this.data.forEach((content) => {
			const typeButton = new TypeButtonDOM(content);
			this.buttonArray.push(typeButton);
		});
		super.createItem();
	}
}

export class UpgradeButtonWrapper extends ButtonWrapper {
	constructor({ className, labelText, buttonContentArray, update = false, onClick = false }) {
		super({ className, labelText, buttonContentArray, update, onClick });
	}

	createItem() {
		this.buttonContentArray.forEach((button) => {
			const btn = new AddonButtonDOM(button);
			this.buttonArray.push(btn);
		});
		super.createItem();
	}
}
