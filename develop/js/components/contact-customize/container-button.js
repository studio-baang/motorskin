export class ButtonContainer {
	constructor({ className = false, item = false, update = false, onClick = false }) {
		this.buttonArray = [];
		this.itemClass = item;

		this.className = className;

		this.handleClick = this.handleClickFn.bind(this);
		this.updateFn = update;
		this.onClickFn = onClick;

		this.init();
	}

	init() {
		this.container = document.createElement("div");
		if (this.className) {
			this.container.classList.add(this.className);
		}
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

		// 컨테이너 초기화
		this.init();

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
			this.container.appendChild(e.DOM);
		});
	}

	render() {
		return this.container;
	}
}
