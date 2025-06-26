/**
 *
 * @typedef {object} typeButtonContent
 * @property {string} title 패키지 버튼 이름
 * @property {string} classType 패키지 유형(basic / premium)
 * @property {number} originPrice 할인 전 가격 
 * @property {number} discountPrice 최종가격

 * @param {typeButtonContent} content
 * @param {boolean} isActive 현재 활성화된 버튼일 경우만 true

 * @returns
 */
export function renderTypeButton(content, isActive) {
	// content property 필터
	// 한화 원 단위로 콤마를 넣는 코드
	const covertPriceLocal = {
		originPrice: content.originPrice.toLocaleString("ko-KR"),
		discountPrice: content.discountPrice.toLocaleString("ko-KR"),
	};

	// 기본 설정
	const element = document.createElement("div");
	element.classList.add("contact-type-button");
	element.dataset.content = content.title;

	if (isActive) {
		element.classList.add("contact-type-button--active");
	}

	element.innerHTML = `<div class="contact-type-button__wrapper">
			<div class="contact-type-button__row">
                <span style="margin-right: auto">${content.classType}</span>
				<h5>${content.title}</h5>
			</div>
			<div class="contact-type-button__row">
				<span class="contact-type-button__origin-price"> 정상가 : ${covertPriceLocal.originPrice}원 </span>
				<span class="contact-type-button__discount-price"> 할인가 : ${covertPriceLocal.discountPrice}원 </span>
			</div>
		</div>`;

	return element;
}
