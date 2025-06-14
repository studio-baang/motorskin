function renderTypeButton(title, originPrice) {
	const activeClass = "contact-type-button--active";
	const data = {
		title: title,
		originPrice: originPrice.toLocaleString("ko-KR"),
		discountPrice: () => {
			const calcDiscointPrice = originPrice / 2;
			return calcDiscointPrice.toLocaleString("ko-KR");
		},
	};

	return `<div class="contact-type-button ${activeClass}" data-content="${data.title}">
		<div class="contact-type-button__wrapper">
			<div class="contact-type-button__row">
				<h5>${data.title}</h5>
			</div>
			<div class="contact-type-button__row">
				<span class="contact-type-button__origin-price"> 정상가 : ${data.originPrice}원 </span>
				<span class="contact-type-button__discount-price"> 할인가 : ${data.discountPrice()}원 </span>
			</div>
		</div>
	</div>`;
}
