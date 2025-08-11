import _ from "lodash";

import { toggleActiveClass } from "../utils/toggle-button";
import { filterAddonData } from "../utils/filter-addon-json";
import { searchDealerCode } from "../utils/search-dealer-code";
import { getTaxonomyData } from "../utils/get-taxonomy-data";

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

		this.blackboxData = [];
		this.upgradeData = [];

		this.packageTypeButtons = document.querySelectorAll(".contact-type-button");

		this.onLoad();
		this.addSubmitEventListener();
	}

	async onLoad() {
		this.blackboxData = await getTaxonomyData("blackbox");
		this.upgradeData = await getTaxonomyData("upgrade");

		this.inputNodes.model.addEventListener("input", () => {
			this.updateReceipt();
		});

		this.packageTypeButtons.forEach((el) => {
			el.addEventListener("click", this.handlePackageTypeButton.bind(this));
		});

		this.renderBlackboxSelect();
		this.renderAddonButtons();

		this.updateReceipt();
	}

	addSubmitEventListener() {
		document.addEventListener(
			"wpcf7mailsent",
			(event) => {
				const formEl = document.querySelector(".wpcf7-form");
				const formData = new FormData(formEl);
				const objData = {};
				formData.forEach((value, key) => (objData[key] = value));
				searchDealerCode(
					this.inputNodes.dealerCode.value,
					async (data) => {
						if (data.googleSheetID && data.googleSheetScriptCode) {
							objData["googleSheetID"] = data.googleSheetID;
							try {
								const response = await fetch(`https://script.google.com/macros/s/${data.googleSheetScriptCode}/exec`, {
									method: "POST",
									headers: { "Content-Type": "text/plain" },
									body: JSON.stringify(objData),
									redirect: "follow",
								});
								const text = await response.text();
								if (text === "success") {
									console.log("문의가 전송되었습니다.");
								} else {
									console.error("문의 전송에 실패했습니다. - 처리 과정 중 에러");
								}
							} catch (error) {
								console.error("문의 전송에 실패했습니다. - 전송 중 에러");
							}
						}
					},
					() => {
						return false;
					}
				);
			},
			false
		);
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
		const filterBlackboxArr = filterAddonData(this.blackboxData, [21, 22, 23]);

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
				// // calc total price
				// const findSelectedArr = filterBlackboxArr.find((arr) => arr.title == e.target.options[e.target.selectedIndex].text);
				// if (findSelectedArr != 0) {
				// 	this.blackboxPrice = findSelectedArr.price;
				// }

				this.updateReceipt();
			});
			blackboxWrapper.appendChild(blackboxSelectbox.render());
		}
	}

	renderAddonButtons() {
		const wrapper = document.getElementById("porsche-form__addon");
		wrapper.classList.add("contact-form__input-wrapper");

		const filterUpgradeArr = filterAddonData(this.upgradeData, [25, 26]);
		const addonButton = new AddonRadioBtn("추가 옵션", filterUpgradeArr);

		// 초기값 설정
		this.inputNodes.addon.value = filterUpgradeArr[0].title;

		addonButton.buttons.forEach((button) => {
			button.addEventListener("click", (e) => {
				const target = e.currentTarget;
				const findSelectedArr = filterUpgradeArr.find((arr) => arr.title == target.dataset.value);

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
