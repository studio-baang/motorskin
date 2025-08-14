import _ from "lodash";

import { requestWpJson } from "../utils/wp-json";
import { filterAddonData } from "../utils/filter-addon-json";

import { renderReceipt } from "../components/contact-receipt";
import { TypeButton } from "../components/contact-type-button";
import { AddonSelectBox } from "../components/contact-select-addon";
import { AddonRadioBtn } from "../components/contact-radio-addon";
import { getTaxonomyData } from "../utils/get-taxonomy-data";

export class PorcsheReceipt {
	priceNum = {
		package: 0,
		tinting: 0,
		blackbox: 0,
		upgrade: 0,
	};

	optionPrice = [
		{
			name: "package",
			value: 0,
		},
		{
			name: "tinting",
			value: 0,
		},
		{
			name: "blackbox",
			value: 0,
		},
		{
			name: "upgrade",
			value: 0,
		},
	];

	tintingData = [];
	blackboxData = [];
	upgradeData = [];
	brandNewPackageOptionData = [];
	dealerPackageOptionData = [];
	carData = [];

	typeButtons = [];
	constructor() {
		this.inputNodes = {
			model: document.querySelector('select[name="model"]'),
			package: document.querySelector('input[name="package"]'),
			packageType: document.querySelector('input[name="package-type"]'),
			blackbox: document.querySelector('input[name="blackbox"]'),
			tinting: document.querySelector('input[name="tinting"]'),
			totalPrice: document.querySelector('input[name="total-price"]'),
			upgrade: document.querySelector('input[name="extra"]'),
		};

		this.wrappers = {
			recepit: this.renderWrapperDom("contact-receipt"),
			typeButton: this.renderWrapperDom("porsche-form__type-button-wrapper"),
			tinting: this.renderWrapperDom("porsche-form__tinting"),
			blackbox: this.renderWrapperDom("porsche-form__blackbox"),
		};

		this.customizeDom = document.querySelector(".contact-form-customize");

		this.onLoad();
	}

	async onLoad() {
		// json으로 모델과 관련된 정보를 수집
		this.tintingData = await getTaxonomyData("tinting");
		this.blackboxData = await getTaxonomyData("blackbox");
		this.upgradeData = await getTaxonomyData("upgrade");
		this.brandNewPackageOptionData = await this.getBrandNewPackageOption();
		this.dealerPackageOptionData = await this.getDealerPackageOption();
		this.carData = await this.updateModelData();

		this.inputNodes.model.addEventListener("input", async () => {
			this.carData = await this.updateModelData();
			this.refreshTypeButton();
		});
		this.refreshTypeButton();
	}

	runUpdatePipeline(typeButton) {
		typeButton.onActiveState();
		this.updatePackageTypeData(typeButton.content.title, typeButton.content.discountPrice);

		this.renderAddonSelectBox(this.tintingData, typeButton.content.tinting, "틴팅 선택", "porsche-form__tinting", this.inputNodes.tinting, "tinting");
		this.renderAddonSelectBox(
			this.blackboxData,
			typeButton.content.blackbox,
			"블랙박스 + 하이패스",
			"porsche-form__blackbox",
			this.inputNodes.blackbox,
			"blackbox"
		);
		this.renderAddonButtons();
	}

	refreshTypeButton() {
		this.renderTypeButton();
		this.updateReceipt();
	}

	renderWrapperDom(className) {
		const div = document.createElement("div");
		if (className) {
			div.classList.add(className);
		}
		return div;
	}

	async updateModelData() {
		const posts = await requestWpJson(`/porsche-dealer/wp-json/wp/v2/car?search=${encodeURIComponent(this.inputNodes.model.value)}`);
		if (posts) {
			return posts[0];
		}
	}

	async getBrandNewPackageOption() {
		const posts = await requestWpJson("/porsche-dealer/wp-json/wp/v2/package-option");
		if (posts) {
			return posts.map((e) => ({
				title: e.title.rendered,
				classType: e.acf.package_class,
				price: {
					typeA: e.acf.type_a,
					typeB: e.acf.type_b,
				},
				blackbox: e.blackbox,
				tinting: e.tinting,
			}));
		}
		return false;
	}

	async getDealerPackageOption() {
		const posts = await requestWpJson("/porsche-dealer/wp-json/wp/v2/dealer-package");
		if (posts) {
			return posts.map((e) => ({
				title: e.title.rendered,
				prices: {
					origin: e.acf.origin_price,
					discount: e.acf.discount_price,
				},
			}));
		}
		return false;
	}

	findPriceObjectByName(name) {
		const target = this.optionPrice.find((item) => item.name === name);
		if (target) {
			return target;
		}
	}

	renderTypeButton() {
		const wrapper = document.getElementById("porsche-form__type-button-wrapper");
		// reset wrapper childe node
		wrapper.innerHTML = "";

		// reset typeButtons array
		this.typeButtons = [];

		// reset package type

		this.brandNewPackageOptionData.forEach((content) => {
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
			if (typeButton.content.title === this.brandNewPackageOptionData[0].title) {
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

	renderTintingSelectBox(data) {
		const filterTintingData = filterAddonData(this.tintingData, data);
		this.renderSelectAddon("틴팅 선택", this.tintingWrapperDom, filterTintingData, this.inputNodes.tinting, "tinting");
	}

	renderBlackboxSelectBox(data) {
		const filterBlackboxData = filterAddonData(this.blackboxData, data);
		this.renderSelectAddon("블랙박스 + 하이패스", this.blackboxWrapperDom, filterBlackboxData, this.inputNodes.blackbox, "blackbox");
	}

	renderAddonSelectBox(originData, filteredID, title, wrapper, inputnode, priceName) {
		const filterData = filterAddonData(originData, filteredID);
		this.renderSelectAddon(title, wrapper, filterData, inputnode, priceName);
	}

	renderSelectAddon(title, wrapper, data, inputnode, priceName) {
		// filter tinting data
		const wrapper = document.getElementById(wrapper);
		const priceObj = this.findPriceObjectByName(priceName);

		wrapper.classList.add("contact-form__input-wrapper");
		wrapper.innerHTML = "";

		inputnode.value = data[0].title;

		priceObj.value = 0;

		if (data.length > 1) {
			wrapper.style.display = "inherit";

			const selectBox = new AddonSelectBox(title, data);
			const selectNode = selectBox.selectNode;

			// calc price
			const findSelectedArr = data.find((arr) => arr.title == selectNode.options[selectNode.selectedIndex].value);
			if (findSelectedArr.length !== 0) {
				priceObj.value = findSelectedArr.price;
			}
			selectNode.addEventListener("input", (e) => {
				// calc total price
				inputnode.value = e.target.value;
				priceObj.value = 0;

				const findSelectedArr = data.find((arr) => arr.title == e.target.options[e.target.selectedIndex].value);
				if (findSelectedArr.length !== 0) {
					priceObj.value = findSelectedArr.price;
				}
				this.updateReceipt();
			});

			wrapper.appendChild(selectBox.render());
		} else {
			wrapper.style.display = "none";
		}
	}

	renderAddonButtons() {
		const wrapper = document.getElementById("porsche-form__extra");
		const filterData = filterAddonData(this.upgradeData, this.carData.upgrade);
		const addonButton = new AddonRadioBtn("추가 옵션", filterData);
		const priceObj = this.findPriceObjectByName("upgrade");

		// 초기값 설정
		wrapper.classList.add("contact-form__input-wrapper");
		wrapper.innerHTML = "";

		this.inputNodes.upgrade.value = filterData[0].title;

		priceObj.value = 0;

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
				priceObj.value = 0;
				if (findSelectedArr.length !== 0) {
					priceObj.value = findSelectedArr.price;
				}
				this.inputNodes.upgrade.value = target.innerHTML;

				this.updateReceipt();
			});
		});

		wrapper.appendChild(addonButton.render());
	}

	renderCustomize() {}

	reduceTotalPrice() {
		// reduce total Price
		let totalPrice = 0;
		totalPrice = this.optionPrice.forEach((item) => {
			totalPrice += item.value;
		});
		this.inputNodes.totalPrice.value = totalPrice;
		return totalPrice;
	}

	updatePackageTypeData(title, price) {
		const priceObj = this.findPriceObjectByName("package");

		this.inputNodes.packageType.value = title;
		priceObj.value = price;
	}

	updateReceipt() {
		const receiptDom = this.wrappers.recepit;
		const totalPrice = this.reduceTotalPrice();

		// reset wrapper inner
		receiptDom.innerHTML = "";
		this.inputNodes.totalPrice.value = totalPrice;

		const element = renderReceipt(
			{
				modelName: this.inputNodes.model.value,
				packageName: this.inputNodes.packageType.value,
			},
			[
				{
					title: "패키지명",
					content: this.inputNodes.packageType.value,
				},
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
					content: this.inputNodes.upgrade.value,
				},
			],
			totalPrice
		);

		receiptDom.appendChild(element);
	}
}

class BrandNewPackageReceipt {}

class DealerPacakgeReceipt {}
