import Swiper from "swiper";
import "swiper/modules/effect-fade.min.css";
import { Autoplay, EffectFade } from "swiper/modules";
import _ from "lodash";
import { getSiteName, isSiteBimmer } from "../utils/filter-site-by-name";

class BimmerReceipt {
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

class Contact {
	constructor() {
		this.siteName = document.querySelector("main").dataset.siteName;

		this.form = document.querySelector(".wpcf7-form");

		this.textarea = document.querySelector(".wpcf7-textarea");
		this.modal = document.querySelector(".agreement-modal");
		this.openModalBtn = document.querySelector(".contact-form__open-modal");
		this.tel = document.querySelector("input[name='tel']");

		this.init();
	}

	init() {
		if (this.textarea) {
			this.textarea.addEventListener("input", this.handleResizeHeight);
		}

		if (this.openModalBtn) {
			this.openModalBtn.addEventListener("click", this.toggleModal);
		}

		if (this.modal) {
			this.modal.addEventListener("click", (e) => {
				this.toggleModal();
			});
		}

		if (this.tel) {
			this.tel.addEventListener("input", _.debounce(this.allowPhoneNumber.bind(this), 17));
		}

		new Swiper(".contact-swiper", {
			modules: [Autoplay, EffectFade],
			loop: true,
			effect: "fade",
			speed: 750,
			autoplay: {
				delay: 2500,
			},
		});

		if (isSiteBimmer()) {
			new BimmerReceipt();
		}
	}

	toggleModal = () => {
		this.modal.classList.toggle("agreement-modal--open");
	};

	handleResizeHeight = () => {
		if (this.textarea) {
			this.textarea.style.height = "auto"; // 초기화
			this.textarea.style.height = `${this.textarea.scrollHeight}px`;
		}
	};

	allowPhoneNumber(e) {
		const input = e.target;
		const filterInput = input.value.replace(/\D/g, "");

		// 번호 포맷팅
		if (filterInput.length <= 3) {
			// 3자리 이하
			input.value = filterInput;
		} else if (filterInput.length <= 7) {
			// 3-7자리
			input.value = filterInput.slice(0, 3) + "-" + filterInput.slice(3);
		} else {
			// 8자리 이상
			input.value = filterInput.slice(0, 3) + "-" + filterInput.slice(3, 7) + "-" + filterInput.slice(7, 11);
		}
	}
}

export default Contact;
