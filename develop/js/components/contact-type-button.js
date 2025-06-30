export class TypeButton {
	/**
 		*
 		* @typedef {object} typeButtonContent
 		* @property {string} title 패키지 버튼 이름
 		* @property {string} classType 패키지 유형(basic / premium)
 		* @property {number} originPrice 할인 전 가격 
 		* @property {number} discountPrice 최종가격
			
 		* @param {typeButtonContent} content
			
 		* @returns
 		*/
	constructor(content) {
		// content property 필터
		// 한화 원 단위로 콤마를 넣는 코드
		this.content = content;
		this.isActive = false;

		this.covertPriceLocal = {
			originPrice: content.originPrice.toLocaleString("ko-KR"),
			discountPrice: content.discountPrice.toLocaleString("ko-KR"),
		};

		this.element = document.createElement("div");
		this.element.classList.add("contact-type-button");
		this.element.dataset.content = this.content.title;

		this.element.innerHTML = `<div class="contact-type-button__wrapper">
				<div class="contact-type-button__row">
					<span style="margin-right: auto">${this.content.classType}</span>
					<h5>${this.content.title}</h5>
				</div>
				<div class="contact-type-button__row">
					<span class="contact-type-button__origin-price"> 정상가 : ${this.covertPriceLocal.originPrice}원 </span>
					<span class="contact-type-button__discount-price"> 할인가 : ${this.covertPriceLocal.discountPrice}원 </span>
				</div>
			</div>`;
	}

	toggleClass() {
		if (this.isActive) {
			this.element.classList.add("contact-type-button--active");
		} else {
			this.element.classList.remove("contact-type-button--active");
		}
	}

	render = () => {
		return this.element;
	};
}
