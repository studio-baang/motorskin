export function renderTypeButton(data, isActive) {
	// 기본 설정
	const element = document.createElement("div");
	element.classList.add("contact-type-button");
	element.dataset.content = data.title;

	if (isActive) {
		element.classList.add("contact-type-button--active");
	}

	const filterData = {
		title: data.title,
		classType: data.classType,
		originPrice: data.price.typeA.toLocaleString("ko-KR"),
		discountPrice: () => {
			const calcDiscointPrice = data.price.typeA / 2;
			return calcDiscointPrice.toLocaleString("ko-KR");
		},
	};

	element.innerHTML = `<div class="contact-type-button__wrapper">
			<div class="contact-type-button__row">
                <span>${filterData.classType}</span>
				<h5>${filterData.title}</h5>
			</div>
			<div class="contact-type-button__row">
				<span class="contact-type-button__origin-price"> 정상가 : ${filterData.originPrice}원 </span>
				<span class="contact-type-button__discount-price"> 할인가 : ${filterData.discountPrice()}원 </span>
			</div>
		</div>`;

	return element;
}
