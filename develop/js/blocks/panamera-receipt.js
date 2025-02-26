import _ from "lodash";
import { getSiteName } from "../utils/filter-site-by-name";

export class panameraReceipt {
	constructor() {
		this.sitename = getSiteName();

		this.form = document.querySelector(".wpcf7-form");
		this.receipt = document.querySelector(".contact-receipt");

		this.packageInputs = document.querySelectorAll('input[name="package"]');
		this.packageValue = "";

		this.packageTypebuttons = document.querySelectorAll(".contact-type-button");
		this.packageTypeValue = "";

		this.priceTag = document.getElementById("contact-receipt-amount");

		this.modelInput = document.querySelector('select[name="model"]');
		this.modelValue = this.modelInput.value;

		this.price = 0;

		this.packageList = [
			{
				id: 0,
				content: "PPF 신차패키지",
				activeClassName: ".contact-option--01",
				typeHTML: (optionObj) => {
					const { tinting, blackbox, sportDesign } = optionObj;
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
								<p>${tinting ? tinting.content : "선택 안함"}</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>블랙박스</h5>
								<p>${blackbox ? blackbox.content : "선택 안함"}</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>스포츠 디자인</h5>
								<p>${sportDesign ? sportDesign.content : "선택 안함"}</p>
							</li>
							<li class="contact-receipt__options-list">
								<p><b>유리 초발수</b> RAIN<br><b>실내 가죽</b> 9H / 탑코드<br><b>휠 코팅</b>  휠 & 캘리퍼</p>
							</li>`;
				},
				typeInputEl: document.getElementById("package-01-type"),
				type: [
					{
						id: 0,
						price: 6000000,
						content: "카바차 필름",
					},
					{
						id: 1,
						price: 5500000,
						content: "프리미엄 모터가드 필름",
					},
				],
				tintingInputEl: document.querySelector('select[name="package-tinting"]'),
				tinting: [
					{
						id: 0,
						content: "Upgrade : 솔라가드 LX (+ 300,000원)",
						price: 300000,
					},
					{
						id: 1,
						content: "Upgrade : 루마 버텍스 1100 (+ 300,000원)",
						price: 300000,
					},
					{
						id: 2,
						content: "Upgrade : 후퍼옵틱 프나세 (+ 300,000원)",
						price: 300000,
					},
					{
						id: 3,
						content: "솔라가드 퀀텀 (- 300,000원)",
						price: -300000,
					},
					{
						id: 4,
						content: "후퍼옵틱 클래식 (- 300,000원)",
						price: -300000,
					},
					{
						id: 5,
						content: "루마 버텍스 700 (-300,000원)",
						price: -300000,
					},
					{
						id: 6,
						content: "후퍼옵틱 GK (- 600,000원)",
						price: -600000,
					},
				],
				sportDesignInputEls: document.querySelectorAll('input[name="package-sport-design"]'),
				sportDesign: [
					{
						content: "스포츠 디자인 패키지 추가 (+500,000원)",
						price: 500000,
					},
				],
				blackboxInputEl: document.querySelector('select[name="package-blackbox"]'),
				blackbox: [
					{
						content: "Upgrade : 퀀텀 4K PRO (+100,000원)",
						price: 100000,
					},
					{
						content: "블랙박스 선택 안함 (-500,000원)",
						price: -500000,
					},
				],
			},
			{
				id: 1,
				content: "올인원 패키지",
				activeClassName: ".contact-option--02",
				typeHTML: (optionObj) => {
					const { type } = optionObj;
					let ppfContent = "본넷, 도어4판, <span>생활보호 6종</span> (헤드라이트/ 도어엣지/ 도어캐치 /주유구/ 트렁크리드/ 사이드미러)";
					if (type.id === 1) {
						ppfContent = "본넷, 범퍼 양쪽 앞휀다, <span>생활보호 6종</span> (헤드라이트/ 도어엣지/ 도어캐치 /주유구/ 트렁크리드/ 사이드미러)";
					}
					return `<li class="contact-receipt__options-list">
								<h5>PPF 시공 부위</h5>
								<p>${ppfContent}</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>썬팅</h5>
								<p>버텍스 900 시리즈 기본 적용</p>
							</li>
							<li class="contact-receipt__options-list">
								<h5>코팅</h5>
								<p>세라믹프로 케어 플러스 코팅</p>
							</li>`;
				},
				typeInputEl: document.getElementById("package-02-type"),
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
				customTintingInputEls: document.querySelectorAll('input[name="package-02-custom-tinting"]'),
			},
			{
				id: 2,
				content: "PPF 필름 메인터넌스",
				price: 800000,
				typeHTML: () => {
					return `<li class="contact-receipt__options-list">
								<h5>프리미엄 디테일링 세차</h5>
							</li>
							<li class="contact-receipt__options-list">
								<h5>PPF 및 필름 표면 복원 및 광택 시공</h5>
							</li>
							<li class="contact-receipt__options-list">
								<h5>세라믹프로 PPF & VINYL 베이스코트 도포</h5>
							</li>
							<li class="contact-receipt__options-list">
								<h5>세라믹프로 PPF & VINYL 탑코트 도포</h5>
							</li>
							<li class="contact-receipt__options-list">
								<h5>세라믹프로 휠 & 캘리퍼 코팅 시공</h5>
							</li>
							<li class="contact-receipt__options-list">
								<h5>고온 열경화 공정</h5>
							</li>
							<li class="contact-receipt__options-list">
								<h5>PPF 마감 교정 및 들뜸 보정 작업</h5>
							</li>`;
				},
			},
		];

		this.currentPackage = {
			id: 0,
			typeEl: {},
			type: {},
			tinting: "",
			sportDesign: "",
			blackbox: "",
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

		this.packageTypebuttons.forEach((el) => {
			el.addEventListener("click", this.updateReceipt.bind(this));
		});
		this.packageList.forEach((item) => {
			if (item.id === 0) {
				this.observe(item.tintingInputEl);
				this.observe(item.blackboxInputEl);
				item.sportDesignInputEls.forEach((item) => {
					this.observe(item);
				});
			}
		});

		this.form.addEventListener("submit", this.ignoreOtherInputs());
	}

	observe(el) {
		el.addEventListener("input", this.updateReceipt.bind(this));
	}

	updateReceipt(event) {
		let activeTypeBtn = false;
		if (event) {
			activeTypeBtn = event.currentTarget && event.currentTarget.classList.contains("contact-type-button") ? event.currentTarget : false;
		}

		// update simple data
		this.modelValue = this.modelInput.value;
		for (const packageInput of this.packageInputs) {
			this.packageValue = packageInput.checked ? packageInput.value : this.packageValue;
		}

		this.selectedPackage = this.packageList.find((item) => item.content == this.packageValue);
		this.currentPackage.id = this.selectedPackage.id;

		// update need filter data
		this.updatePackageTypeFunc(activeTypeBtn);
		this.updatePriceFunc();

		// toggle class
		this.toggleClassAsOptions();
		this.toggleClassTypeButton(activeTypeBtn);

		// this.toggleDisableInputs();

		// update html
		this.updateReceiptTitleHTML();
		this.updateReceiptPackageNameHTML();
		this.updateReceiptDetailHTML();
		this.priceTag.innerHTML = this.price.toLocaleString("ko-KR");
	}

	toggleClassTypeButton(activeTypeBtn) {
		if (activeTypeBtn) {
			this.packageTypebuttons.forEach((item) => {
				// 화면에 표기된 버튼만 active를 지움
				if (item.offsetParent !== null) {
					item.classList.remove("contact-type-button--active");
				}
			});
			activeTypeBtn.classList.add("contact-type-button--active");
		}
		return false;
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

	updatePackageTypeFunc(curTarget) {
		// 메인터넌스 외 package types 선택
		if (this.currentPackage.id !== 2) {
			const typeInput = this.selectedPackage.typeInputEl;
			const selectedPackageType = this.selectedPackage.type;
			let typeChr = typeInput.value;
			if (curTarget) {
				typeChr = curTarget.dataset.content;
				typeInput.value = typeChr;
			}
			this.currentPackage.typeEl = typeInput;
			this.currentPackage.type = selectedPackageType.find((item) => item.content === typeChr);
			// 메인터넌스
		} else {
			this.currentPackage.typeEl = false;
			this.currentPackage.type = false;
		}
		// 신차 패키지
		if (this.currentPackage.id === 0) {
			const tintingInput = this.selectedPackage.tintingInputEl;
			const sportDesignInputs = this.selectedPackage.sportDesignInputEls;
			const blackInput = this.selectedPackage.blackboxInputEl;

			// tinting
			const selectedPackageTinting = this.selectedPackage.tinting;
			const findTinting = selectedPackageTinting.find((item) => item.content === tintingInput.value);
			this.currentPackage.tinting = findTinting ?? { content: tintingInput.value };

			// blackbox
			const selectedPackageBlackbox = this.selectedPackage.blackbox;
			const findBlackbox = selectedPackageBlackbox.find((item) => item.content === blackInput.value);
			this.currentPackage.blackbox = findBlackbox ?? { content: blackInput.value };

			// sport design
			for (const input of sportDesignInputs) {
				if (input.checked) {
					const selectedPackageSportDesign = this.selectedPackage.sportDesign;
					const findSportDesign = selectedPackageSportDesign.find((item) => item.content === input.value);
					this.currentPackage.sportDesign = findSportDesign ?? { content: input.value };
				}
			}
		} else {
			this.currentPackage.blackbox = false;
			this.currentPackage.sportDesign = false;
			this.currentPackage.tinting = false;
		}
	}

	updatePriceFunc() {
		// set package types
		let calcPrice = 0;
		if (this.currentPackage.id !== 2) {
			calcPrice = this.currentPackage.type.price;
		} else {
			// 메인터넌스
			calcPrice = this.selectedPackage.price;
		}
		if (this.currentPackage.tinting.price) {
			calcPrice += this.currentPackage.tinting.price;
		}
		if (this.currentPackage.sportDesign.price) {
			calcPrice += this.currentPackage.sportDesign.price;
		}
		if (this.currentPackage.blackbox.price) {
			calcPrice += this.currentPackage.blackbox.price;
		}
		this.price = calcPrice;
	}

	updateReceiptTitleHTML() {
		const receiptTitle = document.querySelector("#contact-receipt-title");
		receiptTitle.innerHTML = this.modelValue;
	}

	updateReceiptPackageNameHTML() {
		const receiptPromotion = document.querySelector("#contact-receipt-promotion");
		receiptPromotion.innerHTML = this.currentPackage.type ? `${this.currentPackage.type.content} ${this.packageValue}` : this.packageValue;
	}

	updateReceiptDetailHTML() {
		const optionEl = document.querySelector("#contact-receipt__options");
		optionEl.innerHTML = this.selectedPackage.typeHTML({
			type: this.currentPackage.type,
			tinting: this.currentPackage.tinting,
			sportDesign: this.currentPackage.sportDesign,
			blackbox: this.currentPackage.blackbox,
		});
	}
	// form 제출 시 선택한 패키지를 제외한 값을 제거
	ignoreOtherInputs = () => {
		function resetInputsValue(el) {
			if (el instanceof NodeList) {
				el.forEach((item) => {
					item.value = "";
				});
				return false;
			}
			console.log(el);

			el.value = "";
		}
		if (this.currentPackage.id === 0) {
			const ignorePackage = this.packageList[1];
			resetInputsValue(ignorePackage.typeInputEl);
			resetInputsValue(ignorePackage.customTintingInputEls);
			// 신차 패키지
		} else if (this.currentPackage.id === 1) {
			// 올인원 패키지
			const ignorePackage = this.packageList[0];
			resetInputsValue(ignorePackage.typeInputEl);
			resetInputsValue(ignorePackage.tintingInputEl);
			resetInputsValue(ignorePackage.sportDesignInputEls);
			resetInputsValue(ignorePackage.blackboxInputEl);
		} else {
			// 메인터넌스
			return false;
		}
	};
}
