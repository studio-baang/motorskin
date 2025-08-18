import _ from "lodash";

import { requestWpJson } from "../utils/wp-json";
import { filterAddonData } from "../utils/filter-addon-json";

import { renderReceipt } from "../components/contact-receipt";
import { TypeButton } from "../components/contact-type-button";
import { AddonSelectBox } from "../components/contact-select-addon";
import { AddonRadioBtn } from "../components/contact-radio-addon";
import { getTaxonomyData } from "../utils/get-taxonomy-data";
import { contactLabelDOM } from "../components/contact-form-label";

class Figment {
	constructor(prop) {
		this.figment = document.createDocumentFragment();

		if (prop.labelText) {
			this.figment.appendChild(contactLabelDOM(prop.labelText));
		}
	}

	render() {
		return this.figment;
	}
}

class TypeButtonWrappperDOM extends Figment {
	typeButtons = [];

	constructor() {
		super("패키지 선택");
		this.contentDOM = document.createElement("div");
		this.handleClick = this.handleClickFn.bind(this);
	}

	createTypeButtons(data) {
		data.forEach((content) => {
			const typeButton = new TypeButton(content);
			this.typeButtons.push(typeButton);
			typeButton.element.addEventListener("click", this.handleClickFn);
		});
	}

	handleClickFn(e) {
		this.typeButtons.forEach((btn) => btn.offActiveState());
		const clickedBtn = this.typeButtons.find((btn) => btn.element === e.currentTarget);
		if (clickedBtn) {
			this.runUpdatePipeline(clickedBtn);
			this.updateReceipt();
		}
	}

	resetTypeButtons() {
		// 리스너 해제
		this.typeButtons.forEach((typeButton) => {
			typeButton.element.removeEventListener("click", this.handleClickFn);
		});

		// DOM 제거
		this.contentDOM.innerHTML = "";

		// 참조 제거
		this.typeButtons = [];
	}
}

class PackageButtonDOM extends Figment {
	constructor({ buttonContentArray }) {
		super();

		buttonContentArray.forEach((buttonContent) => {
			this.figment.appendChild(this.createButton(buttonContent.title, buttonContent.content));
		});
	}

	createButton(title, content) {
		const buttonDOM = document.createElement("div");
		buttonDOM.classList.add("package-price-card");
		buttonDOM.classList.add("package-price-card--contact-form");

		const titleDOM = document.createElement("span");
		titleDOM.classList.add("package-price-card__title");
		titleDOM.innerHTML = title;

		const contentDOM = document.createElement("span");
		contentDOM.innerHTML = content;

		buttonDOM.appendChild(titleDOM);
		buttonDOM.appendChild(contentDOM);

		return buttonDOM;
	}
}

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
			receipt: this.createWrapperDom("contact-receipt"),
			typeButton: this.createWrapperDom("porsche-form__type-button"),
			tinting: this.createWrapperDom("porsche-form__tinting"),
			blackbox: this.createWrapperDom("porsche-form__blackbox"),
		};

		this.customizeDom = document.querySelector(".contact-form-customize");

		const packageButtonWrapperDOM = this.create2ColsWrapper();
		packageButtonWrapperDOM.appendChild(
			new PackageButtonDOM({
				buttonContentArray: [
					{ title: "모터스킨 PPF 신차 패키지", content: "필요한 모든 것을 담은 신차 패키지<br/>취향에 맞게 당신만의 패키지를 구성하세요." },
					{ title: "딜러 3종 패키지", content: "전체 PPF + 프리미엄 케어 + 딜러 3종 + 신차검수까지<br/>최대 50% 할인 혜탹" },
				],
			}).render()
		);
		// this.onLoad();
	}

	async onLoad() {
		// json으로 모델과 관련된 정보를 수집
		this.tintingData = await getTaxonomyData("tinting");
		this.blackboxData = await getTaxonomyData("blackbox");
		this.upgradeData = await getTaxonomyData("upgrade");
		this.brandNewPackageOptionData = await this.getBrandNewPackageOption();
		this.dealerPackageOptionData = await this.getDealerPackageOption();
		this.carData = await this.updateModelData();

		// this.modelClickHandler();
		// this.refreshTypeButton();
	}

	createWrapperDom(className) {
		const div = document.createElement("div");
		if (className) {
			div.classList.add(className);
		}
		return div;
	}

	create2ColsWrapper() {
		return createWrapperDom("contact-form__2cols");
	}

	modelClickHandler() {
		this.inputNodes.model.addEventListener("input", async () => {
			this.carData = await this.updateModelData();
			this.refreshTypeButton();
		});
	}

	runUpdatePipeline(typeButton) {
		typeButton.onActiveState();
		this.updatePackageTypeData(typeButton.content.title, typeButton.content.discountPrice);

		this.renderAddonSelectBox(this.tintingData, typeButton.content.tinting, "틴팅 선택", this.wrappers.tinting, this.inputNodes.tinting, "tinting");
		this.renderAddonSelectBox(
			this.blackboxData,
			typeButton.content.blackbox,
			"블랙박스 + 하이패스",
			this.wrappers.blackbox,
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

	findPriceObjectByName(name) {
		const target = this.optionPrice.find((item) => item.name === name);
		if (target) {
			return target;
		}
	}

	renderAddonSelectBox(originData, filteredID, title, wrapper, inputnode, priceName) {
		const filterData = filterAddonData(originData, filteredID);
		this.renderSelectAddon(title, wrapper, filterData, inputnode, priceName);
	}

	renderSelectAddon(title, wrapperID, data, inputnode, priceName) {
		// filter tinting data
		const wrapper = document.getElementById(wrapperID);
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
			if (findSelectedArr) {
				priceObj.value = findSelectedArr.price;
			}
			selectNode.addEventListener("input", (e) => {
				// calc total price
				inputnode.value = e.target.value;
				priceObj.value = 0;

				const findSelectedArr = data.find((arr) => arr.title == e.target.options[e.target.selectedIndex].value);
				if (findSelectedArr) {
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
				if (findSelectedArr) {
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
		return this.optionPrice.reduce((sum, item) => sum + item.value, 0);
	}

	updatePackageTypeData(title, price) {
		const priceObj = this.findPriceObjectByName("package");

		this.inputNodes.packageType.value = title;
		priceObj.value = price;
	}

	updateReceipt() {
		const receiptDom = this.wrappers.receipt;
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
