import _ from "lodash";
import { requestWpJson } from "../utils/wp-json";

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
		const codeParam = urlParams.get("code");
		this.drawSearchResult(_.escape(codeParam));
	}

	onSubmit() {
		this.form.addEventListener("submit", function (e) {
			e.preventDefault(); // 새로고침 막기

			const formData = new FormData(this.form);
			console.log(formData);

			const params = new URLSearchParams(formData).toString();

			const newUrl = `${window.location.pathname}?${params}`;
			history.pushState(null, "", newUrl); // 또는 replaceState로 대체 가능
		});
	}

	drawSearchResult(dealerCode) {
		// reset innerhtml
		this.resultEl.innerHTML = "";

		if (!dealerCode) {
			this.resultEl.innerHTML = "코드를 입력해 주세요.";
			return false;
		}

		const splitDealerCode = this.splitDealerCode(dealerCode);

		// search dealer code data
		const searchCode = requestWpJson(`/porsche-dealer/wp-json/wp/v2/dealer-code?search=${splitDealerCode.codeName}`, (posts) => {
			if (0 < dealerCode.codeNumber <= posts[0].acf.range) {
				const data = {
					titleEn: posts[0].acf.title_en,
					titleKr: posts[0].acf.title_kr,
					dealerCode: dealerCode,
				};
				this.resultEl.appendChild(this.renderCoupon(data));
			} else {
				this.resultEl.innerHTML = "코드를 찾을 수 없습니다.";
			}
		});

		if (!searchCode) {
			this.resultEl.innerHTML = "코드를 찾을 수 없습니다.";
		}
	}

	splitDealerCode(inputData) {
		const len = inputData.length;

		if (len < 2) {
			return [inputData, ""]; // 문자열이 2자 이하인 경우
		}

		const splitPos = len - 2;

		const firstPart = inputData.substring(0, splitPos);
		const secondPart = parseInt(inputData.substring(splitPos), 10); // 문자열을 정수로 변환

		return {
			codeName: firstPart,
			codeNumber: secondPart,
		};
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
	    		<span></span>
	    	</div>
	    </div>
	    <a href="/porsche-dealer/dealer-form/?code=${dealerCode}" class="dealer-coupon__CTA">
	    	<span>딜러 패키지 적용하기</span>
	    </a>`;

		return element;
	}
}
