export class DealerCode {
	constructor() {
		this.form = document.getElementById("form-search-code");
		this.resultEl = document.getElementsByClassName("search-code__result");

		this.onSubmit();
	}

	onLoad() {}

	onSubmit() {
		this.form.addEventListener("submit", function (e) {
			e.preventDefault(); // 새로고침 막기

			const formData = new FormData(form);
			const params = new URLSearchParams(formData).toString();

			const newUrl = `${window.location.pathname}?${params}`;
			history.pushState(null, "", newUrl); // 또는 replaceState로 대체 가능
		});
	}

	filterGetData() {
		return false;
	}

	splitDealerCode(inputData) {
		const len = inputData.length;

		if (len < 2) {
			return [inputData, ""]; // 문자열이 2자 이하인 경우
		}

		const splitPos = len - 2;

		const firstPart = inputData.substring(0, splitPos);
		const secondPart = parseInt(inputData.substring(splitPos), 10); // 문자열을 정수로 변환

		return [firstPart, secondPart];
	}

	renderCoupon(data) {
		const element = document.createElement("div");
		const { titleEn, titleKr, dealerCode } = data;

		element.classList.add("dealer-coupon");

		element.innerHTML = `<div class="dealer-coupon__content">
	    	<div class="dealer-coupon__title-wrapper">
	    		<h3 class="dealer-coupon__title">${titleEn}</h3>
	    		<span class="dealer-coupon__sub-title">${titleKr}</span>
	    	</div>
	    	<div class="dealer-coupon__info-wrapper">
	    		<h4>Dealer Code</h4>
	    		<span>${dealerCode}</span>
	    	</div>
	    </div>
	    <a href="<?php echo add_package_code_data($keyword)?>" class="dealer-coupon__CTA">
	    	<span>딜러 패키지 적용하기</span>
	    </a>`;

		return element;
	}
}
