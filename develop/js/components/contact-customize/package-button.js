class ContactButtonDOM {
	constructor({ className = [], activeClassName } = {}) {
		this.DOM = document.createElement("div");
		this.isActive = false;
		this.className = [...className];
		this.activeClassName = activeClassName ?? "contact-type-button--active";
	}
	init() {
		this.className.forEach((n) => {
			this.DOM.classList.add(n);
		});
	}

	onButtonActive() {
		this.isActive = true;
		this.DOM.classList.add(this.activeClassName);
	}

	update(callback) {
		if (callback) {
			callback(this.DOM);
		}
	}

	onClick(onClickFn) {
		this.onButtonActive();
		if (onClickFn) {
			onClickFn(this.DOM);
		}
	}

	offButtonActive() {
		this.isActive = false;
		this.DOM.classList.remove(this.activeClassName);
	}

	render() {
		return this.DOM;
	}
}

// 패키지 타입 버튼
export class TypeButtonDOM extends ContactButtonDOM {
	constructor(content) {
		super({
			className: ["contact-type-button"],
		});
		this.data = {
			title: content.title,
			classType: content.classType ?? false,
			originPrice: content.originPrice,
			discountPrice: content.discountPrice,
		};

		this.init();
	}

	init() {
		super.init();
		this.DOM.dataset.content = this.data.title;
		this.DOM.dataset.price = this.data.discountPrice;

		const wrapper = document.createElement("div");
		wrapper.classList.add("contact-type-button__wrapper");

		const leftDOM = document.createElement("div");
		leftDOM.classList.add("contact-type-button__row");
		if (this.data.classType) {
			const classTypeDOM = document.createElement("span");
			classTypeDOM.style.marginRight = "auto";
			classTypeDOM.innerText = this.data.classType;
			leftDOM.appendChild(classTypeDOM);
		}

		const titleDOM = document.createElement("h5");
		titleDOM.innerText = this.data.title;
		leftDOM.appendChild(titleDOM);

		const rightDOM = document.createElement("div");
		rightDOM.classList.add("contact-type-button__row");

		const originPriceDOM = document.createElement("span");
		originPriceDOM.classList.add("contact-type-button__origin-price");
		originPriceDOM.innerText = `정상가 : ${this.data.originPrice.toLocaleString("ko-KR")}원`;
		rightDOM.appendChild(originPriceDOM);

		const discountPriceDOM = document.createElement("span");
		discountPriceDOM.classList.add("contact-type-button__discount-price");
		discountPriceDOM.innerText = `할인가 : ${this.data.discountPrice.toLocaleString("ko-KR")}원`;
		rightDOM.appendChild(discountPriceDOM);

		wrapper.appendChild(leftDOM);
		wrapper.appendChild(rightDOM);

		this.DOM.appendChild(wrapper);
	}
}

// 신차 패키지 <-> 딜러 패키지 버튼
export class PackageButtonDOM extends ContactButtonDOM {
	constructor({ title, content }) {
		super({
			className: ["contact-type-button", "contact-type-button--no-margin"],
		});
		this.init(title, content);
	}

	init(title, content) {
		super.init();
		this.DOM.dataset.content = title;
		this.DOM.appendChild(this.childNode(title, content));
	}

	childNode(title, content) {
		const figment = document.createDocumentFragment();

		const titleDOM = document.createElement("p");
		titleDOM.classList.add("contact-type-button__title");
		titleDOM.innerHTML = title;

		const contentDOM = document.createElement("p");
		contentDOM.innerHTML = content;

		figment.appendChild(titleDOM);
		figment.appendChild(contentDOM);

		return figment;
	}
}

export class AddonButtonDOM extends ContactButtonDOM {
	constructor({ title }) {
		super({
			className: ["contact-option-button"],
			activeClassName: "contact-option-button--active",
		});

		this.init(title);
	}

	init(title) {
		super.init();
		this.DOM.dataset.content = title;
		this.DOM.innerText = title;
	}
}
