import _ from "lodash";
import { getSiteName } from "../utils/filter-site-by-name";

export class panameraReceipt {
	constructor() {
		this.sitename = getSiteName();

		this.receipt = document.querySelector(".contact-receipt");

		this.packageInputs = document.querySelectorAll('input[name="package"]');
		this.packageValue = "Package A";

		this.priceTag = document.getElementById("contact-receipt-amount");

		this.modelInput = document.querySelector('select[name="model"]');
		this.modelValue = this.modelInput.value;

		this.basicPrice = 0;
		this.finalPrice = 0;

		this.packageList = [
			{
				id: 0,
				content: {
					title: "PPF 신차패키지",
				},
			},
			{
				id: 1,
				content: {
					title: "올인원 패키지",
				},
			},
			{
				id: 2,
				content: {
					title: "올인원 패키지",
				},
			},
		];

		if (this.receipt) {
			this.init();
		}
	}

	init() {
		this.updateReceipt();
		this.observe(this.modelInput);

		for (const packageInput of this.packageInputs) {
			this.observe(packageInput);
		}

		for (const addOns of this.addOnsArr) {
			for (const target of addOns.el) {
				this.observe(target);
			}
		}
	}

	observe(el) {
		el.addEventListener("input", this.updateReceipt.bind(this));
	}

	updateReceipt() {
		this.modelValue = this.modelInput.value;
		for (const packageInput of this.packageInputs) {
			this.packageValue = packageInput.checked ? packageInput.value : this.packageValue;
		}
		this.updateReceiptData(this.modelValue, this.packageValue);
	}

	updateReceiptContent() {
		const diffs = document.querySelectorAll(".contact-receipt__diff");

		for (const diff of diffs) {
			diff.classList.remove("contact-receipt__diff--current");

			if (this.packageValue == "Package B" && diff.classList.contains("contact-receipt__diff--b")) {
				diff.classList.add("contact-receipt__diff--current");
			}
			if (this.packageValue == "Package A" && diff.classList.contains("contact-receipt__diff--a")) {
				diff.classList.add("contact-receipt__diff--current");
			}
		}
	}

	updateReceiptTitle() {
		const receiptTitle = document.querySelector("#contact-receipt-title");
		receiptTitle.innerHTML = `${this.modelValue}&nbsp<span>${this.packageValue}</span>`;
	}

	updatePriceFunc() {
		this.finalPrice = this.basicPrice;
		this.addOnsArr.forEach((element) => {
			this.finalPrice += element.addPrice;
		});

		const resultPriceNum = Number(this.finalPrice);

		this.priceTag.innerHTML = resultPriceNum.toLocaleString("ko-KR");
	}

	updateAddons() {
		let addonHTML = "";

		this.addOnsArr.forEach((element) => {
			for (let index = 0; index < element.el.length; index++) {
				const radio = element.el[index];
				element.isInactive = true;
				element.addPrice = 0;
				if (index !== element.el.length - 1 && radio.checked) {
					const content = element.content[index];
					const title = content.title;
					const price = Number(content.price);

					element.isInactive = false;
					element.addPrice = price;
					addonHTML += `<li class="contact-receipt__add-ons-list">
								<h5>${title}</h5>
								<span>+${price.toLocaleString("ko-KR")}원</span>
							</li>`;
					break;
				}
			}
		});

		if (_.every(this.addOnsArr, { isInactive: true })) {
			addonHTML = `<li class="contact-receipt__add-ons-list">
							<h5>추가옵션 없음</h5>
						</li>`;
		}
		this.addOnsContentContainer.innerHTML = addonHTML;
	}

	async updateReceiptData(title, packageName) {
		this.receipt.classList.add("contact-receipt--loading");

		try {
			// REST API 엔드포인트 생성
			const endpoint = `/${this.sitename ? this.sitename + "/" : ""}wp-json/wp/v2/car?search=${encodeURIComponent(title)}`;

			// Fetch API로 요청
			const response = await fetch(endpoint);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// 응답 데이터(JSON) 파싱
			const posts = await response.json();

			// 검색 결과 처리
			if (posts.length > 0) {
				this.basicPrice = packageName == "Package A" ? posts[0].acf.package_a_price : posts[0].acf.package_b_price;

				this.updateReceiptTitle();
				this.updateReceiptContent();
				this.updateAddons();
				this.updatePriceFunc();
				this.receipt.classList.remove("contact-receipt--loading");
			} else {
				console.log("No posts found for the given title in Custom Post Type.");
				return null;
			}
		} catch (error) {
			console.error("Error fetching custom post:", error);
		}
	}
}
