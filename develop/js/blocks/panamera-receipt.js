import _ from "lodash";
import { getSiteName } from "../utils/filter-site-by-name";

export class panameraReceipt {
	constructor() {
		this.sitename = getSiteName();

		this.receipt = document.querySelector(".contact-receipt");

		this.packageInputs = document.querySelectorAll('input[name="package"]');
		this.packageValue = "";

		this.priceTag = document.getElementById("contact-receipt-amount");

		this.modelInput = document.querySelector('select[name="model"]');
		this.modelValue = this.modelInput.value;

		this.price = 0;

		this.packageList = [
			{
				id: 0,
				content: "PPF 신차패키지",
				activeClassName: ".contact-option--01",
				optionHTML: (title, content) => {
					return `<li class="contact-receipt__options-list">
											<h5>${title}</h5>
											<p>${content}</p>
										</li>`;
				},
				addonHTML: (title, price) => {
					return `<li class="contact-receipt__add-ons-list">
								<h5>${title}</h5>
								<span>+${price.toLocaleString("ko-KR")}원</span>
							</li>`;
				},
				typeInputEl: document.querySelectorAll('input[name="package-01-type"]'),
				type: [
					{
						id: 0,
						price: 6000000,
						content: "카바차 적용 신차 풀 패키지",
					},
					,
					{
						id: 1,
						price: 5500000,
						content: "모터가드 필름 적용 신차 풀 패키지",
					},
				],
				tintingInputEl: document.querySelectorAll('input[name="package-01-tinting"]'),
				tinting: [
					{
						id: 0,
						content: "솔라가드 LX",
						price: 300000,
					},
					{
						id: 1,
						content: "루마 버텍스 1100",
						price: 300000,
					},
					{
						id: 2,
						content: "후퍼옵틱 프리미엄 나노 세라믹",
						price: 300000,
					},
					{
						id: 3,
						content: "솔라가드 퀀텀",
						price: -300000,
					},
					{
						id: 4,
						content: "후퍼옵틱 클래식",
						price: -300000,
					},
				],
				sportDesignInputEl: document.querySelectorAll('input[name="package-01-sport-design"]'),
				sportDesign: {
					content: "스포츠 디자인 패키지 추가",
					price: 500000,
				},
				blackboxInputEl: document.querySelectorAll('input[name="package-01-blackbox"]'),
				blackbox: {
					content: "선택안함",
					price: -500000,
				},
			},
			{
				id: 1,
				content: "올인원 패키지",
				activeClassName: ".contact-option--02",
				typeInputEl: document.querySelectorAll('input[name="package-02-type"]'),
				type: [
					{
						id: 0,
						price: 2500000,
						content: "주차안심 패키지",
					},
					{
						id: 1,
						price: 2600000,
						content: "프론트 패키지",
					},
				],
			},
			{
				id: 2,
				content: "PPF 필름 메인터넌스",
				price: 800000,
			},
		];

		this.currentPackageID = 0;
		this.currentPackageType = {};
		this.selectedPackage = this.packageList[this.currentPackageID];

		if (this.receipt) {
			this.init();
		}
	}

	init() {
		function setObserveWhenNodeLoaded(el) {
			if (el) {
				this.observe(el);
			}
		}
		this.updateReceipt();
		this.observe(this.modelInput);

		for (const packageInput of this.packageInputs) {
			this.observe(packageInput);
		}

		this.packageList.forEach((item) => {
			console.log(item.typeInputEl, item.tintingInputEl, item.sportDesignInputEl, item.blackboxInputEl);
			setObserveWhenNodeLoaded(item.typeInputEl);
			setObserveWhenNodeLoaded(item.tintingInputEl);
			setObserveWhenNodeLoaded(item.sportDesignInputEl);
			setObserveWhenNodeLoaded(item.blackboxInputEl);
		});
	}

	observe(el) {
		el.addEventListener("input", this.updateReceipt.bind(this));
	}

	updateReceipt() {
		this.modelValue = this.modelInput.value;
		for (const packageInput of this.packageInputs) {
			this.packageValue = packageInput.checked ? packageInput.value : this.packageValue;
		}

		this.selectedPackage = this.packageList.find((item) => item.content == this.packageValue);
		this.currentPackageID = this.selectedPackage.id;

		// this.updatePriceFunc();

		// toggle class
		this.toggleClassAsOptions();

		// update html
		this.updateReceiptTitleHTML();
		this.updateReceiptPackageNameHTML();
		// this.priceTag.innerHTML = resultPriceNum.toLocaleString("ko-KR");
	}

	toggleClassAsOptions() {
		// toggle class
		const inputOptionWrapper = document.querySelectorAll(".contact-option");
		inputOptionWrapper.forEach((item) => {
			item.classList.remove("contact-option--active");
			// PPF 필름 메인터넌스 외
			if (this.currentPackageID !== 2) {
				const activeClassName = this.selectedPackage.activeClassName;
				const activeClassEls = document.querySelectorAll(activeClassName);
				activeClassEls.forEach((el) => {
					el.classList.add("contact-option--active");
				});
			}
		});
	}

	updatePackageTypeFunc() {
		// set package types
		if (this.currentPackageID !== 2) {
			const typeInputs = this.selectedPackage.typeInputEl;
			for (const typeInput of typeInputs) {
				this.currentPackageType = typeInput.checked ? typeInput.value : this.currentPackageType;
			}
			// ID가 0 일떄
		} else if (this.currentPackageID == 0) {
		}
	}

	updateReceiptTitleHTML() {
		const receiptTitle = document.querySelector("#contact-receipt-title");
		receiptTitle.innerHTML = this.modelValue;
	}

	updateReceiptPackageNameHTML() {
		const receiptPromotion = document.querySelector("#contact-receipt-promotion");
		receiptPromotion.innerHTML = this.packageValue;
	}

	updatePriceFunc() {
		this.finalPrice = this.basicPrice;

		const resultPriceNum = Number(this.finalPrice);
	}
}
