import _ from "lodash";
import tintingJSON from "/data/tinting.json" assert { type: "json" };
import blackboxJSON from "/data/blackbox.json" assert { type: "json" };
import extraJSON from "/data/addon-extra.json" assert { type: "json" };

import { requestWpJson } from "../utils/wp-json";
import { filterAddonData } from "../utils/filter-addon-json";

import { renderReceipt } from "../components/contact-receipt";
import { TypeButton } from "../components/contact-type-button";
import { AddonSelectBox } from "../components/contact-select-addon";
import { AddonRadioBtn } from "../components/contact-radio-addon";

export class PorcsheReceipt {
	constructor() {
		/**
		 * 	{
		 *  	title: string,
		 * 		class: string,
		 * 		price: {
		 * 			typeA : number,
		 * 			typeB : number
		 * 		}
		 *	}
		 */
		this.packageOption = [];
		this.inputNodes = {
			model: document.querySelector('select[name="model"]'),
			packageType: document.querySelector('input[name="package-type"]'),
			blackbox: document.querySelector('input[name="blackbox"]'),
			tinting: document.querySelector('input[name="tinting"]'),
			totalPrice: document.querySelector('input[name="total-price"]'),
			extra: document.querySelector('input[name="extra"]'),
		};

		this.priceNum = {
			package: 0,
			tinting: 0,
			blackbox: 0,
			extra: 0,
			total: 0,
		};

		this.tintingData = tintingJSON;

		this.typeButtons = [];
		this.filteredTintingData = [];

		this.carData = null;

		this.onLoad();

		this.inputNodes.model.addEventListener("input", this.updateModelData.bind(this));
	}

	async onLoad() {
		// json으로 모델과 관련된 정보를 수집
		await this.updatePackageOption();
		this.updateModelData();
	}

	runUpdatePipeline(typeButton) {
		typeButton.onActiveState();
		this.updatePackageTypeData(typeButton.content.title, typeButton.content.discountPrice);

		this.renderTintingSelectBox(typeButton.content.tinting);
		this.renderBlackboxSelectBox(typeButton.content.blackbox);
		this.renderAddonButtons();
	}

	// 패키지 옵션 표기

	async updateModelData() {
		const posts = await requestWpJson(`/porsche-dealer/wp-json/wp/v2/car?search=${encodeURIComponent(this.inputNodes.model.value)}`);
		if (posts) {
			this.carData = posts[0];
		}
		this.renderTypeButton();

		// draw receipt
		this.updateReceipt();
	}

	async updatePackageOption() {
		const posts = await requestWpJson("/porsche-dealer/wp-json/wp/v2/package-option");
		if (posts) {
			this.packageOption = posts.map((e) => ({
				title: e.title.rendered,
				classType: e.acf.package_class,
				price: {
					typeA: e.acf.type_a,
					typeB: e.acf.type_b,
				},
				blackbox: e.acf.blackbox,
				tinting: e.acf.tinting,
			}));
		}
	}

	renderTypeButton() {
		const wrapper = document.getElementById("porsche-form__type-button-wrapper");
		// reset wrapper childe node
		wrapper.innerHTML = "";

		// reset typeButtons array
		this.typeButtons = [];

		// reset package type

		this.packageOption.forEach((content) => {
			const originPrice = this.carData.acf.is_type_a ? content.price.typeA : content.price.typeB;

			const typeButton = new TypeButton({
				title: content.title,
				classType: content.classType,
				originPrice: originPrice,
				discountPrice: originPrice / 2,
				blackbox: content.blackbox,
				tinting: content.tinting,
			});

			// set default data at first load
			if (typeButton.content.title === this.packageOption[0].title) {
				this.runUpdatePipeline(typeButton);
			}

			this.typeButtons.push(typeButton);

			wrapper.appendChild(typeButton.render());
		});

		this.clickTypeButtonsHandler();
	}

	clickTypeButtonsHandler() {
		this.typeButtons.forEach((typeButton) => {
			typeButton.element.addEventListener("click", (e) => {
				// remove active button
				this.typeButtons.forEach((typeButton) => {
					typeButton.offActiveState();
				});

				if (e.currentTarget === typeButton.element) {
					this.runUpdatePipeline(typeButton);
					this.updateReceipt();
				}
			});
		});
	}

	renderSelectAddon(title, wrapperID, data, inputnode, priceName) {
		// filter tinting data
		const wrapper = document.getElementById(wrapperID);

		wrapper.classList.add("contact-form__input-wrapper");
		wrapper.innerHTML = "";

		inputnode.value = data[0].title;
		this.priceNum[priceName] = 0;

		if (data.length > 1) {
			wrapper.style.display = "inherit";

			const selectBox = new AddonSelectBox(title, data);
			const selectNode = selectBox.selectNode;

			// calc total price
			const findSelectedArr = data.find((arr) => arr.title == selectNode.options[selectNode.selectedIndex].value);
			if (findSelectedArr.length !== 0) {
				this.priceNum[priceName] = findSelectedArr.price;
			}
			selectNode.addEventListener("input", (e) => {
				// calc total price
				inputnode.value = e.target.value;
				this.priceNum[priceName] = 0;

				const findSelectedArr = data.find((arr) => arr.title == e.target.options[e.target.selectedIndex].value);
				if (findSelectedArr.length !== 0) {
					this.priceNum[priceName] = findSelectedArr.price;
				}
				this.updateReceipt();
			});

			wrapper.appendChild(selectBox.render());
		} else {
			wrapper.style.display = "none";
		}
	}

	renderTintingSelectBox(data) {
		const filterTintingData = filterAddonData(tintingJSON, data);
		this.renderSelectAddon("틴팅 선택", "porsche-form__tinting", filterTintingData, this.inputNodes.tinting, "tinting");
	}

	renderBlackboxSelectBox(data) {
		const filterBlackboxData = filterAddonData(blackboxJSON, data);
		this.renderSelectAddon("블랙박스 + 하이패스", "porsche-form__blackbox", filterBlackboxData, this.inputNodes.blackbox, "blackbox");
	}

	renderAddonButtons() {
		const wrapper = document.getElementById("porsche-form__extra");
		const filterData = filterAddonData(extraJSON, this.carData.acf.extra);

		const addonButton = new AddonRadioBtn("추가 옵션", filterData);

		// 초기값 설정
		wrapper.classList.add("contact-form__input-wrapper");
		wrapper.innerHTML = "";

		this.inputNodes.extra.value = filterData[0].title;
		this.priceNum.extra = 0;

		addonButton.buttons.forEach((button) => {
			button.addEventListener("click", (e) => {
				const target = e.currentTarget;
				const findSelectedArr = filterData.find((arr) => arr.title == target.dataset.value);

				// toggle active class
				addonButton.buttons.forEach((allButton) => {
					allButton.classList.remove("contact-option-button--active");
				});
				target.classList.add("contact-option-button--active");

				// calc addon price
				this.priceNum.extra = 0;
				if (findSelectedArr.length !== 0) {
					this.priceNum.extra = findSelectedArr.price;
				}
				this.inputNodes.extra.value = target.innerHTML;

				this.updateReceipt();
			});
		});

		wrapper.appendChild(addonButton.render());
	}

	reduceTotalPrice() {
		// reduce total Price
		this.priceNum.total = this.priceNum.package + this.priceNum.tinting + this.priceNum.blackbox + this.priceNum.extra;
		this.inputNodes.totalPrice.value = this.priceNum.total;
		return this.priceNum.total;
	}

	updatePackageTypeData(title, price) {
		this.inputNodes.packageType.value = title;
		this.priceNum.package = price;
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
					title: "프리미엄 케어",
				},
				{
					title: "블랙박스 + 하이패스",
					content: this.inputNodes.blackbox.value,
				},
				{
					title: "틴팅",
					content: this.inputNodes.tinting.value,
				},
				{
					title: "추가 옵션",
					content: this.inputNodes.extra.value,
				},
			],
			this.reduceTotalPrice()
		);

		wrapper.appendChild(element);
	}
}
