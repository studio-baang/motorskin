import _ from "lodash";
import tintingJSON from "/data/tinting.json" assert { type: "json" };
import blackboxJSON from "/data/blackbox.json" assert { type: "json" };

import { requestWpJson } from "../utils/wp-json";
import { filterAddonData } from "../utils/filter-addon-json";

import { renderReceipt } from "../components/contact-receipt";
import { TypeButton } from "../components/contact-type-button";
import { AddonSelectBox } from "../components/contact-select-addon";

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
		};

		this.packagePrice = 0;
		this.tintingPrice = 0;
		this.blackboxPrice = 0;
		this.addOnPrice = 0;
		this.totalPrice = 0;

		this.tintingData = tintingJSON;

		this.typeButtons = [];
		this.filteredTintingData = [];

		this.carData = null;

		this.onLoad();

		this.observe(this.inputNodes.model);
	}

	async onLoad() {
		// json으로 모델과 관련된 정보를 수집
		await this.updatePackageOption();
		this.runUpdatePipeline();
	}

	observe(el) {
		el.addEventListener("input", this.runUpdatePipeline.bind(this));
	}

	runUpdatePipeline() {
		this.updateModelData();
	}

	// 패키지 옵션 표기

	async updateModelData() {
		const posts = await requestWpJson(`/porsche-dealer/wp-json/wp/v2/car?search=${encodeURIComponent(this.inputNodes.model.value)}`);
		if (posts) {
			this.carData = posts[0];
		}
		this.renderTypeButton();

		// draw receipt
		this.redrawReceipt();
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
				typeButton.onActiveState();
				this.updatePackageTypeData(typeButton.content.title, typeButton.content.discountPrice);

				this.renderTintingSelectBox(typeButton.content.tinting);
				this.renderBlackboxSelectBox(typeButton.content.blackbox);
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
					typeButton.onActiveState();
					this.updatePackageTypeData(typeButton.content.title, typeButton.content.discountPrice);

					this.renderTintingSelectBox(typeButton.content.tinting);
					this.renderBlackboxSelectBox(typeButton.content.blackbox);

					this.redrawReceipt();
				}
			});
		});
	}

	renderSelectAddon(title, wrapperID, data, inputnode) {
		// filter tinting data
		const wrapper = document.getElementById(wrapperID);
		let addonPrice = 0;

		wrapper.classList.add("contact-form__input-wrapper");
		wrapper.innerHTML = "";

		inputnode.value = data[0].title;
		if (data.length > 1) {
			const selectBox = new AddonSelectBox(title, data);
			const selectNode = selectBox.selectNode;

			selectNode.addEventListener("input", (e) => {
				inputnode.value = e.target.value;
				addonPrice = 0;
				// calc total price
				const findSelectedArr = data.find((arr) => arr.title == e.target.options[e.target.selectedIndex].value);
				if (findSelectedArr.length > 0) {
					addonPrice = findSelectedArr.price;
				}

				if (title === "틴팅 선택") {
					this.tintingPrice = addonPrice;
				} else {
					this.blackboxPrice = addonPrice;
				}

				this.redrawReceipt();
			});

			wrapper.appendChild(selectBox.render());
		}

		return addonPrice;
	}

	renderTintingSelectBox(data) {
		const filterTintingData = filterAddonData(tintingJSON, data);
		this.renderSelectAddon("틴팅 선택", "porsche-form__tinting", filterTintingData, this.inputNodes.tinting);
	}

	renderBlackboxSelectBox(data) {
		const filterBlackboxData = filterAddonData(blackboxJSON, data);
		this.renderSelectAddon("블랙박스 + 하이패스", "porsche-form__blackbox", filterBlackboxData, this.inputNodes.blackbox);
	}

	reduceTotalPrice() {
		// reduce total Price
		this.totalPrice = this.packagePrice + this.tintingPrice + this.blackboxPrice + this.addOnPrice;
		this.inputNodes.totalPrice.value = this.totalPrice;
		return this.totalPrice;
	}

	updatePackageTypeData(title, price) {
		this.inputNodes.packageType.value = title;
		this.packagePrice = price;
	}

	redrawReceipt() {
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
					title: "블랙박스 + 하이패스",
					content: this.inputNodes.blackbox.value,
				},
				{
					title: "틴팅",
					content: this.inputNodes.tinting.value,
				},
				{
					title: "프리미엄 케어",
				},
			],
			this.reduceTotalPrice()
		);

		wrapper.appendChild(element);
	}
}
