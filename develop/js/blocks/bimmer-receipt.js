import _ from "lodash";
import { getSiteName } from "../utils/filter-site-by-name";

export class BimmerReceipt {
	constructor() {
		this.sitename = getSiteName();

		this.receipt = document.querySelector(".contact-receipt");

		this.packageInputs = document.querySelectorAll('input[name="package"]');
		this.packageValue = "Package A";

		this.priceTag = document.getElementById("contact-receipt-amount");

		this.modelInput = document.querySelector('select[name="model"]');
		this.modelValue = this.modelInput.value;

		this.totalPriceInput = document.querySelector("#total-price");

		this.basicPrice = 0;
		this.price = 0;

		this.addOnsContentContainer = document.querySelector(".contact-receipt__add-ons");
		this.addOnsArr = [
			{
				el: document.querySelectorAll('input[name="add-on-01"]'),
				isInactive: true,
				addPrice: 0,
				content: [
					{
						title: "본네트 PPF",
						price: 400000,
					},
				],
			},
			{
				el: document.querySelectorAll('input[name="add-on-02"]'),
				isInactive: true,
				addPrice: 0,
				content: [
					{
						title: "주차 안심 도어 4판",
						price: 800000,
					},
				],
			},
			{
				el: document.querySelectorAll('input[name="add-on-03"]'),
				isInactive: true,
				addPrice: 0,
				content: [
					{
						title: "범퍼 양쪽 사이드",
						price: 200000,
					},
					{
						title: "앞,뒤 범퍼 양쪽 사이드",
						price: 400000,
					},
				],
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
		this.updateReceiptData(this.modelValue);
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
		this.addOnsArr.forEach((element) => {
			this.price += element.addPrice;
		});

		this.price = Number(this.price);
		this.price = this.price.toLocaleString("ko-KR");

		this.totalPriceInput.value = this.price;
		this.priceTag.innerHTML = this.price;
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

	async updateReceiptData(title) {
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
				this.price = this.packageValue == "Package A" ? posts[0].acf.package_a_price : posts[0].acf.package_b_price;

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
