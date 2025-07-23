import _ from "lodash";

import blackboxJSON from "/data/blackbox.json" assert { type: "json" };

import { requestWpJson } from "../utils/wp-json";
import { toggleActiveClass } from "../utils/toggle-button";
import { filterAddonData } from "../utils/filter-addon-json";

import { renderTypeButton } from "../components/contact-type-button";
import { renderReceipt } from "../components/contact-receipt";
import { AddonSelectBox } from "../components/contact-select-addon";
import { AddonRadioBtn } from "../components/contact-radio-addon";

export class PorcsheDearerReceipt {
	constructor() {
		this.inputNodes = {
			model: document.querySelector('select[name="model"]'),
			packageType: document.querySelector('input[name="package-type"]'),
			blackbox: document.querySelector('input[name="blackbox"]'),
			addon: document.querySelector('input[name="addon"]'),
			totalPrice: document.querySelector('input[name="total-price"]'),
			dealerCode: document.querySelector('input[name="code"]'),
		};

		// this.price = [
		// 	{ key: "카바차 3.0 PPF", value: 5000000 },
		// 	{ key: "모터가드 PPF", value: 4500000 },
		// 	{ key: "글로벌 PPF", value: 3900000 },
		// ];

		this.exceptBlackboxData = {
			id: -1,
			title: "블랙박스 선택 안함 (-200,000원)",
			price: -200000,
		};

		this.addOnArr = [
			{
				title: "선택 안함",
				price: 0,
			},
			{
				title: "스포츠 디자인 패키지 / 에이프론 추가",
				price: 500000,
			},
		];

		this.blackboxPrice = 0;
		this.addOnPrice = 0;
		this.totalPrice = this.findPrice();

		this.packageTypeButtons = document.querySelectorAll(".contact-type-button");

		this.init();

		document.addEventListener(
			"wpcf7submit",
			function (event) {
				const formData = new FormData(contactForm);
				const objData = {};
				formData.forEach((value, key) => (objData[key] = value));
				console.log(formData);
			},
			false
		);
	}

	init() {
		this.observe("model");

		this.packageTypeButtons.forEach((el) => {
			el.addEventListener("click", this.handlePackageTypeButton.bind(this));
		});

		this.renderBlackboxSelect();
		this.renderAddonButtons();

		this.updateReceipt();
	}

	observe(key) {
		this.inputNodes[key].addEventListener("input", () => {
			this.updateReceipt();
		});
	}

	handlePackageTypeButton(e) {
		const button = e.currentTarget;
		const selectedValue = button.dataset.content;

		if (!selectedValue) return; // 안정성 체크

		this.inputNodes.packageType.value = selectedValue;

		toggleActiveClass(this.packageTypeButtons, this.inputNodes.packageType.value, "contact-type-button--active");

		this.updateReceipt();
	}

	renderBlackboxSelect() {
		// filter data
		const filterBlackboxArr = filterAddonData(blackboxJSON, [2, 3, 4]);

		const blackboxWrapper = document.getElementById("porsche-form__blackbox");
		blackboxWrapper.classList.add("contact-form__input-wrapper");

		blackboxWrapper.innerHTML = "";

		// 초기값 설정
		this.inputNodes.blackbox.value = filterBlackboxArr[0].title;

		if (filterBlackboxArr.length > 1) {
			const blackboxSelectbox = new AddonSelectBox("블랙박스 + 하이패스", filterBlackboxArr);
			const selectNode = blackboxSelectbox.selectNode;

			selectNode.addEventListener("input", (e) => {
				this.inputNodes.blackbox.value = e.target.value;
				this.blackboxPrice = 0;
				// calc total price
				const findSelectedArr = filterBlackboxArr.find((arr) => arr.title == e.target.options[e.target.selectedIndex].text);
				if (findSelectedArr != 0) {
					this.blackboxPrice = findSelectedArr.price;
				}

				this.updateReceipt();
			});
			blackboxWrapper.appendChild(blackboxSelectbox.render());
		}
	}

	renderAddonButtons() {
		const wrapper = document.getElementById("porsche-form__addon");
		const addonButton = new AddonRadioBtn("추가 옵션", this.addOnArr);

		// 초기값 설정
		this.inputNodes.addon.value = this.addOnArr[0].title;

		addonButton.buttons.forEach((button) => {
			button.addEventListener("click", (e) => {
				const target = e.currentTarget;
				const findSelectedArr = this.addOnArr.find((arr) => arr.title == target.dataset.value);

				// toggle active class
				addonButton.buttons.forEach((allButton) => {
					allButton.classList.remove("contact-option-button--active");
				});
				target.classList.add("contact-option-button--active");

				// calc addon price
				this.addOnPrice = 0;
				if (findSelectedArr != 0) {
					this.addOnPrice = findSelectedArr.price;
				}
				this.inputNodes.addon.value = target.innerHTML;

				this.updateReceipt();
			});
		});

		wrapper.appendChild(addonButton.render());
	}

	findPrice() {
		const findPrice = this.price.find((p) => p.key == this.inputNodes.packageType.value);
		return findPrice.value;
	}

	updateReceipt() {
		const wrapper = document.getElementById("contact-receipt");
		// reset wrapper inner
		wrapper.innerHTML = "";

		const element = renderReceipt(
			{
				modelName: this.inputNodes.model.value,
				packageName: this.inputNodes.packageType.value,
			},
			[
				{
					title: "전체 PPF 시공",
					content: "루프 제외 모든 도장면에 시공되는 품목입니다.",
				},
				{
					title: "블랙박스",
					content: this.inputNodes.blackbox.value,
				},
				{
					title: "틴팅",
					content: "후퍼옵틱 GK",
				},
				{
					title: "추가 옵션",
					content: this.inputNodes.addon.value,
				},
			],
			false,
			{
				dealerCodeValue: this.inputNodes.dealerCode.value,
			}
		);

		wrapper.appendChild(element);
	}
}
