export class ButtonContainer {
	constructor({ item = false, update = false, onClick = false }) {
		this.fragment = document.createDocumentFragment();

		this.buttonArray = [];
		this.itemClass = item;

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
		this.fragment = document.createDocumentFragment();

		// 참조 제거
		this.buttonArray = [];
	}

	createItem() {
		this.data.forEach((button) => {
			const btn = new this.itemClass(button);
			this.buttonArray.push(btn);
		});
		this.buttonArray.forEach((e, i) => {
			if (i == 0) {
				e.onButtonActive();
				if (this.updateFn) {
					e.update(this.updateFn);
				}
			}
			e.DOM.addEventListener("click", this.handleClick);
			this.fragment.appendChild(e.DOM);
		});
	}

	render() {
		return this.fragment;
	}
}
