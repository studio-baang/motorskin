import Swiper from "swiper";
import "swiper/modules/effect-fade.min.css";
import { Autoplay, EffectFade } from "swiper/modules";

class Contact {
	constructor() {
		this.form = document.querySelector(".wpcf7-form");
		this.receipt = document.querySelector(".contact-receipt");

		this.textarea = document.querySelector(".wpcf7-textarea");
		this.modal = document.querySelector(".agreement-modal");
		this.openModalBtn = document.querySelector(".contact-form__open-modal");
		this.tel = document.querySelector("input[name='tel']");
		this.modelInput = document.querySelector('select[name="model"]');
		this.packageInputs = document.querySelectorAll('input[name="package"]');
		this.priceTag = document.getElementById("contact-receipt-amount");

		this.modelValue = this.modelInput.value;
		this.packageValue = "Package A";

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
				if (e.target.classList.contains("agreement-modal")) {
					this.toggleModal();
				}
			});
		}

		if (this.tel) {
			this.allowPhoneNumber();
		}

		if (this.receipt) {
			this.initReceipt();
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

	allowPhoneNumber = () => {
		this.tel.addEventListener("input", function (e) {
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
		});
	};

	initReceipt() {
		this.updateReceipt();
		this.modelInput.addEventListener("input", this.updateReceipt.bind(this));
		for (const packageInput of this.packageInputs) {
			packageInput.addEventListener("input", this.updateReceipt.bind(this));
		}
	}

	updateReceipt() {
		this.modelValue = this.modelInput.value;
		for (const packageInput of this.packageInputs) {
			this.packageValue = packageInput.checked ? packageInput.value : this.packageValue;
		}
		this.updateReceiptTitle();
		this.toggleReceiptDiff();
		this.updatePrice();
	}

	toggleReceiptDiff() {
		const diffs = document.querySelectorAll(".contact-receipt__diff");
		const diffA = document.querySelector(".contact-receipt__diff--a");
		const diffB = document.querySelector(".contact-receipt__diff--b");

		for (const diff of diffs) {
			diff.classList.remove("contact-receipt__diff--current");

			if (this.packageValue == "Package B") {
				diffB.classList.add("contact-receipt__diff--current");
			} else {
				diffA.classList.add("contact-receipt__diff--current");
			}
		}
	}

	updateReceiptTitle() {
		const receiptTitle = document.querySelector("#contact-receipt-title");
		receiptTitle.innerHTML = `${this.modelValue}&nbsp<span>${this.packageValue}</span>`;
	}

	async getPriceByPost(title, packageName) {
		try {
			// REST API 엔드포인트 생성
			const endpoint = `/wp-json/wp/v2/promotion-1?search=${encodeURIComponent(title)}`;

			// Fetch API로 요청
			const response = await fetch(endpoint);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// 응답 데이터(JSON) 파싱
			const posts = await response.json();

			// 검색 결과 처리
			if (posts.length > 0) {
				return packageName == "Package A" ? posts[0].acf.package_a_price : posts[0].acf.package_b_price;
			} else {
				console.log("No posts found for the given title in Custom Post Type.");
				return null;
			}
		} catch (error) {
			console.error("Error fetching custom post:", error);
		}
	}

	updatePrice() {
		const basicPrice = this.getPriceByPost(this.modelValue, this.packageValue);

		console.log(basicPrice);
		this.priceTag.innerHTML = basicPrice;
	}
}

export default Contact;
