import _, { extend } from "lodash";

import { requestWpJson, WpJson } from "../utils/wp-json";
import { filterAddonDataFn } from "../utils/filter-addon-json";

import { renderReceipt } from "../components/contact-receipt";
import { AddonRadioBtn } from "../components/contact-radio-addon";
import { filterTaxonomyData } from "../utils/get-taxonomy-data";

// import { TypeButtonWrapper } from "../components/contact-customize/wrapper-type-button";
import { PackageButtonWrapper, UpgradeButtonWrapper, TypeButtonWrapper } from "../components/contact-customize/wrapper-button";
import { SelectWrapper } from "../components/contact-customize/wrapper-select";

import { checkDealerCode, splitDealerCode } from "../utils/search-dealer-code";
import { renderLoadingIcon } from "../components/loading-icon";
import { Wrapper } from "../components/contact-customize/wrapper";

const SITENAME = "";
const DEALERPACKAGENAME = "dealer-package";
const BRANDNEWPACKAGENAME = "package-option";
const WPJSON = "wp-json/wp/v2";

export class PorcsheReceipt {
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

	// render 순서
	wrapper = [
		{
			key: "package",
			node: false,
		},
		{
			key: "type button",
			node: false,
		},
		{
			key: "tinting",
			node: false,
		},
		{
			key: "blackbox",
			node: false,
		},
		{
			key: "upgrade",
			node: false,
		},
		{
			key: "receipt",
			node: false,
		},
	];

	jsonData = {
		tinting: [],
		blackbox: [],
		upgrade: [],
		brandNewPackage: [],
		dealerPackage: [],
		car: [],
		brandNewPackageInfo: {},
		dealerPackageInfo: {},
	};

	activeTypeButton = {
		tinting: null,
		blackbox: null,
		json: null,
	};

	isDealerCodeActive = false;

	constructor() {
		this.inputNodes = {
			model: document.querySelector('select[name="model"]'),
			package: document.querySelector('input[name="package"]'),
			packageType: document.querySelector('input[name="package-type"]'),
			blackbox: document.querySelector('input[name="blackbox"]'),
			tinting: document.querySelector('input[name="tinting"]'),
			totalPrice: document.querySelector('input[name="total-price"]'),
			upgrade: document.querySelector('input[name="extra"]'),
			dealerCode: document.querySelector('input[name="code"]'),
		};

		this.customizeDom = document.querySelector(".contact-form-customize");

		this.init();
	}

	async init() {
		const loadingDOM = renderLoadingIcon();
		this.customizeDom.appendChild(loadingDOM);

		const dealerCodeObj = splitDealerCode(this.inputNodes.dealerCode.value);

		this.fetchWpJSON = new WpJson(SITENAME, WPJSON);
		this.fetchWpJSON.createRequest("tinting", "/tinting");
		this.fetchWpJSON.createRequest("blackbox", "/blackbox");
		this.fetchWpJSON.createRequest("upgrade", "/upgrade");
		this.fetchWpJSON.createRequest("car", "/car?per_page=100");
		this.fetchWpJSON.createRequest("brand new package Info", `/types/${BRANDNEWPACKAGENAME}`);
		this.fetchWpJSON.createRequest("dealer package Info", `/types/${DEALERPACKAGENAME}`);
		this.fetchWpJSON.createRequest("brand new package", `/${BRANDNEWPACKAGENAME}`);
		this.fetchWpJSON.createRequest("dealer package", `/${DEALERPACKAGENAME}`);
		this.fetchWpJSON.createRequest("dealer code", `/dealer-code?aW50ZXJuYWw=true&search=${dealerCodeObj.codeName}`);

		await this.fetchWpJSON.requestData();

		// json으로 모델과 관련된 정보를 수집
		this.jsonData = {
			tinting: filterTaxonomyData(this.fetchWpJSON.findData("tinting")),
			blackbox: filterTaxonomyData(this.fetchWpJSON.findData("blackbox")),
			upgrade: filterTaxonomyData(this.fetchWpJSON.findData("upgrade")),
			brandNewPackage: this.fetchWpJSON.findData("brand new package").map((e) => ({
				title: e.title.rendered,
				classType: e.acf.package_class,
				price: {
					typeA: e.acf.type_a,
					typeB: e.acf.type_b,
				},
				blackbox: e.blackbox,
				tinting: e.tinting,
			})),
			dealerPackage: this.fetchWpJSON.findData("dealer package").map((e) => ({
				title: e.title.rendered,
				prices: {
					origin: e.acf.origin_price,
					discount: e.acf.discount_price,
				},
			})),
			dealerCode: this.fetchWpJSON.findData("dealer code"),
			car: this.fetchWpJSON.findData("car").find((r) => this.inputNodes.model.value === r.title.rendered),
			brandNewPackageInfo: this.filterPacakgeInfo(this.fetchWpJSON.findData("brand new package Info")),
			dealerPackageInfo: this.filterPacakgeInfo(this.fetchWpJSON.findData("dealer package Info")),
		};

		// 딜러코드 활성화 여부 확인
		this.isDealerCodeActive = checkDealerCode(this.inputNodes.dealerCode.value, this.jsonData.dealerCode);

		// loadnig DOM 제거
		this.customizeDom.removeChild(loadingDOM);

		// type button wrapper 선언
		this.findWrapper("type button").node = new Wrapper();

		// 딜러코드 유효시 패키지 버튼 활성화
		if (this.isDealerCodeActive) {
			const acf = this.jsonData.dealerCode.acf;
			this.dealerCodeObj = {
				titleEn: acf.title_en,
				titleKr: acf.title_kr,
				googleSheetID: acf.google_sheet_id,
				googleSheetScriptCode: acf.google_sheet_script_code,
				dealerCode: this.inputNodes.dealerCode.value,
			};

			this.findWrapper("package").node = new PackageButtonWrapper({
				className: "contact-form__2cols",
				buttonContentArray: [
					{ title: this.jsonData.brandNewPackageInfo.title, content: this.jsonData.brandNewPackageInfo.description },
					{ title: this.jsonData.dealerPackageInfo.title, content: this.jsonData.dealerPackageInfo.description },
				],
				update: (target) => {
					this.inputNodes.package.value = target.dataset.content;
					this.updateTypeButton();
				},
				onClick: () => {
					this.refresh();
				},
			});

			this.findWrapper("package").node.update();
		} else {
			this.inputNodes.package.value = this.jsonData.brandNewPackageInfo.title;
			this.updateTypeButton();
		}

		// 틴팅 wrapper 선언
		this.findWrapper("tinting").node = new SelectWrapper({
			labelText: "틴팅",
			update: (value, price) => {
				this.inputNodes.tinting.value = value;
				this.updatePrice("tinting", price);
			},
			onClick: () => {
				this.refresh();
			},
		});

		// 블랙박스 wrapper 선언
		this.findWrapper("blackbox").node = new SelectWrapper({
			labelText: "블랙박스",
			update: (value, price) => {
				this.inputNodes.blackbox.value = value;
				this.updatePrice("blackbox", price);
			},
			onClick: () => {
				this.refresh();
			},
		});

		// 스포츠 디자인 wrapper 선언
		this.findWrapper("upgrade").node = new UpgradeButtonWrapper({
			labelText: "스포츠 디자인 추가",
			className: "contact-form__2cols",
			buttonContentArray: filterAddonDataFn({ data: this.jsonData["upgrade"], idArr: this.jsonData.car.upgrade }),
			update: (target) => {
				this.inputNodes.upgrade.value = target.dataset.content;
			},
			onClick: () => {
				this.refresh();
			},
		});

		// 시공 미리보기 wrapper 선언
		this.findWrapper("receipt").node = new Wrapper({
			className: ["contact-form__input-wrapper", "contact-receipt"],
		});

		//
		this.refresh();

		// 모델명 input 이벤트 리스너 생성
		this.modelClickHandler();
	}

	// 시공 미리보기 창을 input node에 맞게 업데이트하고,
	// active된 wrapper을 화면에 그립니다.
	refresh() {
		this.updateReceipt();
		this.redrawCustomzieDOM();
	}

	findWrapper(key) {
		return this.wrapper.find((e) => e.key == key);
	}

	updatePrice(name, value) {
		this.optionPrice.find((e) => e.name == name).value = Number(value);
	}

	updatePackageType(target) {
		this.inputNodes.packageType.value = target.dataset.content;
		this.updatePrice("package", target.dataset.price);
	}

	updateActiveTypeButton() {
		this.activeTypeButton.json = this.jsonData.brandNewPackage.find((e) => e.title == this.inputNodes.packageType.value);
		this.activeTypeButton.tinting = this.filterTypeButtonAddonData("tinting");
		this.activeTypeButton.blackbox = this.filterTypeButtonAddonData("blackbox");
	}

	filterTypeButtonAddonData(keyword) {
		return filterAddonDataFn({ data: this.jsonData[keyword], idArr: this.activeTypeButton.json[keyword] });
	}

	modelClickHandler() {
		this.inputNodes.model.addEventListener("input", async () => {
			this.jsonData.car = this.fetchWpJSON.findData("car").find((r) => this.inputNodes.model.value == r.title.rendered);

			this.updateTypeButton();
			this.refresh();
		});
	}

	// customize form 업데이트 관련
	updateTypeButton() {
		const typeButtonWrapper = this.findWrapper("type button");
		// 신차 패키지
		if (this.inputNodes.package.value == this.jsonData.brandNewPackageInfo.title) {
			const isTypeA = this.jsonData.car.acf.is_type_a;
			typeButtonWrapper.node.update(
				this.jsonData.brandNewPackage.map((r) => ({
					title: r.title,
					classType: r.classType,
					originPrice: isTypeA ? r.price.typeA / 2 : r.price.typeB / 2,
					discountPrice: isTypeA ? r.price.typeA : r.price.typeB,
				}))
			);
		} else {
			typeButtonWrapper.node.update(
				this.jsonData.dealerPackage.map((r) => ({
					title: r.title,
					originPrice: r.prices.origin,
					discountPrice: r.prices.discount,
				}))
			);
		}
	}

	updateUpgradeButton() {
		this.findWrapper("upgrade").node.update(filterAddonDataFn({ data: this.jsonData["upgrade"], idArr: this.jsonData.car.upgrade }));
	}

	redrawCustomzieDOM() {
		this.customizeDom.innerHTML = "";
		const activeWrappers = this.wrapper.filter((e) => e.node);
		activeWrappers.forEach((e) => {
			if (e.node.DOM.hasChildNodes()) {
				e.node.appendTo(this.customizeDom);
			}
		});
	}

	filterPacakgeInfo(data) {
		if (data) {
			return {
				title: data.name,
				description: data.description,
			};
		}
		return false;
	}

	reduceTotalPrice() {
		return this.optionPrice.reduce((sum, item) => sum + item.value, 0);
	}

	updateReceipt() {
		const receiptDom = this.findWrapper("receipt").node.DOM;
		const totalPrice = this.reduceTotalPrice();

		receiptDom.classList.add("contact-receipt");

		// reset wrapper inner
		receiptDom.innerHTML = "";
		this.inputNodes.totalPrice.value = totalPrice;

		const optionArr = [];

		if (this.inputNodes.packageType.value) {
			optionArr.push({
				title: "패키지명",
				content: this.inputNodes.packageType.value,
			});
		}

		optionArr.push({
			title: "전체 PPF 시공",
			content: "루프 제외 모든 도장면에 시공되는 품목입니다.",
		});

		if (this.inputNodes.tinting.value) {
			optionArr.push({
				title: "틴팅",
				content: this.inputNodes.tinting.value,
			});
		}

		if (this.inputNodes.blackbox.value) {
			optionArr.push({
				title: "블랙박스 + 하이패스",
				content: this.inputNodes.blackbox.value,
			});
		}

		if (this.inputNodes.upgrade.value) {
			optionArr.push({
				title: "추가 옵션",
				content: this.inputNodes.upgrade.value,
			});
		}

		optionArr.push({
			title: "프리미엄 케어",
		});

		if (this.isDealerCodeActive) {
			optionArr.push({
				title: "담당 지점",
				content: this.dealerCodeObj.titleKr,
			});
		}

		const element = renderReceipt(
			{
				modelName: this.inputNodes.model.value,
				packageName: this.inputNodes.package.value,
			},
			optionArr,
			totalPrice
		);

		receiptDom.appendChild(element);
	}
}
