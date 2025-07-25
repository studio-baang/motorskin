import { escape } from "lodash";

export class DealerCode {
	constructor() {
		this.form = document.getElementById("form-search-code");
		this.resultEl = document.querySelector(".search-code__result");

		this.onLoad();
		this.onSubmit();
	}

	onLoad() {
		const url = new URL(window.location.href);
		const urlParams = url.searchParams;

		let dealerCode = urlParams.get("code");
		dealerCode = escape(dealerCode);

		this.drawDealerSearchRecult(dealerCode);
	}

	onSubmit() {
		this.form.addEventListener("submit", (e) => {
			e.preventDefault(); // 새로고침 막기

			const formData = new FormData(e.target);
			let dealerCode = formData.get("code");

			this.drawDealerSearchRecult(dealerCode);

			const newUrl = `${window.location.pathname}?code=${dealerCode}`;
			history.pushState(null, "", newUrl); // 또는 replaceState로 대체 가능
		});
	}

	drawDealerSearchRecult(dealerCode) {
		const escapeDealerCode = escape(dealerCode);

		// reset innerhtml
		this.resultEl.innerHTML = "";

		if (!escapeDealerCode) {
			this.resultEl.innerHTML = "코드를 입력해 주세요.";
			return false;
		}

		searchDealerCode(
			escapeDealerCode,
			(data) => {
				this.resultEl.appendChild(this.renderCoupon(data));
			},
			() => {
				this.resultEl.innerHTML = "코드를 찾을 수 없습니다.";
			}
		);
	}

	/**
	 *
	 * @param {*} data
	 * @param { String } data.titleEn
	 * @param { String } data.titleKr
	 * @param { String } data.dealerCode
	 * @returns
	 */
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
	    <a href="/porsche-dealer/dealer-form/?code=${dealerCode}" class="dealer-coupon__CTA">
	    	<span>딜러 패키지 적용하기</span>
	    </a>`;

		return element;
	}
}
