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
				typeHTML: (tinting, blackbox) => {
					return `<li class="contact-receipt__options-list">
								<h5>전체 PPF 시공</h5>
								<p>루프 및 (추가: 악세사리 제외) 모든 도장면</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>실내 PPF 시공</h5>
								<p>디스플레이, 센터페시아 실내 하이그로시 부분</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>썬팅</h5>
								<p>${tinting ?? "선택 안함"}</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>블랙박스</h5>
								<p>${blackbox ?? "선택 안함"}</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>유리발수<br>실내가죽<br>휠코팅</h5>
								<p><b>유리 초발수<b/> RAIN<br><b>실내 가죽<b/>  탑코드 / 9H<br><b>휠 코팅<b/>  휠 & 캘리퍼</p>
							</li>`;
				},
				typeInputEl: document.querySelectorAll('input[name="package-01-type"]'),
				type: [
					{
						id: 0,
						price: 6000000,
						content: "카바차 필름",
					},
					{
						id: 1,
						price: 5500000,
						content: "모터가드 필름 적용",
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
				typeHTML: (tinting, blackbox) => {
					return `<li class="contact-receipt__options-list">
								<h5>ㅁㄴㅇㅁㄴㅇ</h5>
								<p>루프 및 (추가: 악세사리 제외) 모든 도장면</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>실내 PPF 시공</h5>
								<p>디스플레이, 센터페시아 실내 하이그로시 부분</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>썬팅</h5>
								<p>${tinting ?? "선택 안함"}</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>블랙박스</h5>
								<p>${blackbox ?? "선택 안함"}</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>유리발수<br>실내가죽<br>휠코팅</h5>
								<p><b>유리 초발수<b/> RAIN<br><b>실내 가죽<b/>  탑코드 / 9H<br><b>휠 코팅<b/>  휠 & 캘리퍼</p>
							</li>`;
				},
				typeInputEl: document.querySelectorAll('input[name="package-02-type"]'),
				type: [
					{
						id: 0,
						price: 2500000,
						content: "주차안심",
					},
					{
						id: 1,
						price: 2600000,
						content: "프론트",
					},
				],
			},
			{
				id: 2,
				content: "PPF 필름 메인터넌스",
				price: 800000,
			},
		];

		this.currentPackage = {
			id: 0,
			type: {},
			tintingValue: "",
			sportDesignValue: "",
			blackboxValue: "",
		};
		this.selectedPackage = this.packageList[this.currentPackage.id];

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

		this.packageList.forEach((item) => {
			if (item.id !== 2) {
				item.typeInputEl.forEach((item) => {
					this.observe(item);
				});
			}
			if (item.id === 0) {
				item.tintingInputEl.forEach((item) => {
					this.observe(item);
				});
				item.sportDesignInputEl.forEach((item) => {
					this.observe(item);
				});
				item.blackboxInputEl.forEach((item) => {
					this.observe(item);
				});
			}
		});
	}

	observe(el) {
		el.addEventListener("input", this.updateReceipt.bind(this));
	}

	updateReceipt() {
		// update simple data
		this.modelValue = this.modelInput.value;
		for (const packageInput of this.packageInputs) {
			this.packageValue = packageInput.checked ? packageInput.value : this.packageValue;
		}

		this.selectedPackage = this.packageList.find((item) => item.content == this.packageValue);
		this.currentPackage.id = this.selectedPackage.id;

		// update need filter data
		this.updatePackageTypeFunc();

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
			if (this.currentPackage.id !== 2) {
				const activeClassName = this.selectedPackage.activeClassName;
				const activeClassEls = document.querySelectorAll(activeClassName);
				activeClassEls.forEach((el) => {
					el.classList.add("contact-option--active");
				});
			}
		});
	}

	setCheckedValue() {}

	updatePackageTypeFunc() {
		// set package types
		if (this.currentPackage.id !== 2) {
			const typeInputs = this.selectedPackage.typeInputEl;
			const optionEl = document.querySelector("#contact-receipt__options");
			for (const typeInput of typeInputs) {
				if (typeInput.checked) {
					const selectedPackageType = this.selectedPackage.type;
					console.log(
						selectedPackageType.find((item) => item.content === typeInput.value),
						typeInput.value
					);
					this.currentPackage.type = selectedPackageType.find((item) => item.content === typeInput.value);
					//
					// optionEl.innerHTML = this.currentPackage.type.typeHTML();
				} else {
				}
			}
		}
		// 신차 패키지
		if (this.currentPackage.id === 0) {
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
