import _ from "lodash";

import { requestWpJson } from "../utils/wp-json";
import { filterAddonData } from "../utils/filter-addon-json";

import { renderReceipt } from "../components/contact-receipt";
import { TypeButton } from "../components/contact-type-button";
import { AddonSelectBox } from "../components/contact-select-addon";
import { AddonRadioBtn } from "../components/contact-radio-addon";
import { getTaxonomyData } from "../utils/get-taxonomy-data";

export class PorcsheReceipt {
	constructor() {
		this.brandNewPackageOptionData = [];
		this.inputNodes = {
			model: document.querySelector('select[name="model"]'),
			package: document.querySelector('input[name="package"]'),
			packageType: document.querySelector('input[name="package-type"]'),
			blackbox: document.querySelector('input[name="blackbox"]'),
			tinting: document.querySelector('input[name="tinting"]'),
			totalPrice: document.querySelector('input[name="total-price"]'),
			upgrade: document.querySelector('input[name="extra"]'),
		};

		this.priceNum = {
			package: 0,
			tinting: 0,
			blackbox: 0,
			upgrade: 0,
			total: 0,
		};

		this.tintingData = [];
		this.blackboxData = [];
		this.upgradeData = [];
		this.brandNewPackageOptionData = [];
		this.dealerPackageOptionData = [];
		this.carData = [];

		this.typeButtons = [];
		this.filteredTintingData = [];

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
		const filterTintingData = filterAddonData(this.tintingData, data);
		this.renderSelectAddon("틴팅 선택", "porsche-form__tinting", filterTintingData, this.inputNodes.tinting, "tinting");
	}

	renderBlackboxSelectBox(data) {
		const filterBlackboxData = filterAddonData(this.blackboxData, data);
		this.renderSelectAddon("블랙박스 + 하이패스", "porsche-form__blackbox", filterBlackboxData, this.inputNodes.blackbox, "blackbox");
	}

	renderAddonSelectBox(originData, filteredID, title, wrapperID, inputnode, priceName) {
		const filterData = filterAddonData(originData, filteredID);
		this.renderSelectAddon(title, wrapperID, filterData, inputnode, priceName);
	}

	renderAddonButtons() {
		const wrapper = document.getElementById("porsche-form__extra");
		const filterData = filterAddonData(this.upgradeData, this.carData.upgrade);

		const addonButton = new AddonRadioBtn("추가 옵션", filterData);

		// 초기값 설정
		wrapper.classList.add("contact-form__input-wrapper");
		wrapper.innerHTML = "";

		this.inputNodes.upgrade.value = filterData[0].title;
		this.priceNum.upgrade = 0;

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
				this.priceNum.upgrade = 0;
				if (findSelectedArr.length !== 0) {
					this.priceNum.upgrade = findSelectedArr.price;
				}
				this.inputNodes.upgrade.value = target.innerHTML;

				this.updateReceipt();
			});
		});

		wrapper.appendChild(addonButton.render());
	}

	reduceTotalPrice() {
		// reduce total Price
		this.priceNum.total = this.priceNum.package + this.priceNum.tinting + this.priceNum.blackbox + this.priceNum.upgrade;
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
					content: this.inputNodes.upgrade.value,
				},
			],
			this.reduceTotalPrice()
		);

		wrapper.appendChild(element);
	}
}
