import { WpJson } from "../utils/wp-json";
import { filterAddonDataFn } from "../utils/filter-addon-json";

import { renderReceipt } from "../components/contact-receipt";

import { filterTaxonomyData } from "../utils/get-taxonomy-data";

import { ButtonContainer } from "../components/contact-customize/container-button";
import { SelectWrapper } from "../components/contact-customize/wrapper-select";

import { checkDealerCode, searchDealerCode, splitDealerCode } from "../utils/search-dealer-code";
import { renderLoadingIcon } from "../components/loading-icon";
import { Wrapper } from "../components/contact-customize/wrapper";
import { AddonButtonDOM, PackageButtonDOM, TypeButtonDOM } from "../components/contact-customize/package-button";

const SITENAME = window.location.hostname == "localhost" ? "" : "/porsche-dealer";
const DEALERPACKAGENAME = "dealer-package";
const BRANDNEWPACKAGENAME = "package-option";
const WPJSON = "wp-json/wp/v2";

export class PorcsheReceipt {
	// render 순서
	wrapperArr = [
		{
			key: "package",
			wrapper: false,
		},
		{
			key: "packageType",
			wrapper: false,
			value: 0,
		},
		{
			key: "tinting",
			label: "틴팅",
			itemType: "selectbox",
			itemClass: SelectWrapper,
			wrapper: false,
			value: 0,
		},
		{
			key: "blackbox",
			label: "블랙박스 + 하이패스",
			itemType: "selectbox",
			itemClass: SelectWrapper,
			update: (value, price) => {
				this.inputNodes[key].value = value;
				this.updatePrice(key, price);
			},
			wrapper: false,
			value: 0,
		},
		{
			key: "upgrade",
			label: "추가옵션",
			itemType: "radio",
			wrapper: false,
			value: 0,
		},
		{
			key: "receipt",
			wrapper: false,
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

	container = {};

	activeItem = { packageType: null };

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
		const dealerCode = splitDealerCode(this.inputNodes.dealerCode.value);
		const filterPacakgeInfo = (data) => {
			return {
				title: data.name,
				description: data.description,
			};
		};

		// 로딩 아이콘 render
		this.customizeDom.appendChild(loadingDOM);

		// 데이터 수집 시작
		this.fetchWpJSON = new WpJson(SITENAME, WPJSON);
		this.fetchWpJSON.createRequest("tinting", "/tinting");
		this.fetchWpJSON.createRequest("blackbox", "/blackbox");
		this.fetchWpJSON.createRequest("upgrade", "/upgrade");
		this.fetchWpJSON.createRequest("car", "/car?per_page=100");
		this.fetchWpJSON.createRequest("brand new package Info", `/types/${BRANDNEWPACKAGENAME}`);
		this.fetchWpJSON.createRequest("dealer package Info", `/types/${DEALERPACKAGENAME}`);
		this.fetchWpJSON.createRequest("brand new package", `/${BRANDNEWPACKAGENAME}`);
		this.fetchWpJSON.createRequest("dealer package", `/${DEALERPACKAGENAME}`);
		this.fetchWpJSON.createRequest("dealer code", `/dealer-code?aW50ZXJuYWw=true&search=${dealerCode.codeName}`);

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
			brandNewPackageInfo: filterPacakgeInfo(this.fetchWpJSON.findData("brand new package Info")),
			dealerPackageInfo: filterPacakgeInfo(this.fetchWpJSON.findData("dealer package Info")),
		};

		// 딜러코드 활성화 여부 확인
		this.isDealerCodeActive = checkDealerCode(this.inputNodes.dealerCode.value, this.jsonData.dealerCode);

		// loadnig DOM 제거
		this.customizeDom.removeChild(loadingDOM);

		// 딜러코드 유효시 패키지 버튼 활성화
		if (this.isDealerCodeActive) {
			const acf = this.jsonData.dealerCode.acf;
			const container = this.container;

			this.dealerCodeObj = {
				titleEn: acf.title_en,
				titleKr: acf.title_kr,
				googleSheetID: acf.google_sheet_id,
				googleSheetScriptCode: acf.google_sheet_script_code,
				dealerCode: this.inputNodes.dealerCode.value,
			};

			container.package = new ButtonContainer({
				className: "contact-form__2cols",
				item: PackageButtonDOM,
				update: (target) => {
					this.inputNodes.package.value = target.dataset.content;
				},
				onClick: () => {
					this.refreshTypeButton();
					this.refreshAddon();
					this.redraw();
				},
			});

			this.findWrapper("package").wrapper = new Wrapper();

			container.package.update(
				[
					{ title: this.jsonData.brandNewPackageInfo.title, content: this.jsonData.brandNewPackageInfo.description },
					{ title: this.jsonData.dealerPackageInfo.title, content: this.jsonData.dealerPackageInfo.description },
				],
				1
			);
			this.findWrapper("package").wrapper.update(container.package.render());
		} else {
			this.inputNodes.package.value = this.jsonData.brandNewPackageInfo.title;
		}

		// type button wrapper 선언
		this.container.typeButton = new ButtonContainer({
			item: TypeButtonDOM,
			className: "contact-form__input-wrapper",
			update: (target) => {
				const content = target.dataset.content;
				const value = target.dataset.price;

				this.inputNodes.packageType.value = content;
				this.activeItem.packageType = content;
				this.updatePrice("packageType", value);
			},
			onClick: () => {
				this.refreshAddon(true);
				this.redraw();
			},
		});
		this.findWrapper("packageType").wrapper = new Wrapper({
			labelText: "패키지 선택",
		});

		this.createSelectbox();

		// 스포츠 디자인 버튼 선언
		this.container.upgrade = new ButtonContainer({
			item: AddonButtonDOM,
			className: ["contact-form__2cols"],
			update: (target) => {
				const content = target.dataset.content;
				const value = target.dataset.price;

				this.inputNodes.upgrade.value = content;
				this.activeItem.upgrade = content;
				this.updatePrice("upgrade", value);
			},
			onClick: () => {
				this.redraw();
			},
		});
		this.findWrapper("upgrade").wrapper = new Wrapper({
			labelText: this.findWrapper("upgrade").label,
		});

		// 시공 미리보기 wrapper 선언
		this.findWrapper("receipt").wrapper = new Wrapper({
			className: ["contact-receipt"],
		});

		this.refreshTypeButton();
		this.refreshAddon();
		this.redraw();

		// 모델명 input 이벤트 리스너 생성
		this.modelClickHandler();

		this.addSubmitEventListener();
	}

	// 시공 미리보기 창을 input node에 맞게 업데이트하고,
	// active된 wrapper을 화면에 그립니다.
	redraw() {
		this.updateReceipt();
		this.redrawCustomzieDOM();
	}

	addSubmitEventListener() {
		document.addEventListener(
			"wpcf7mailsent",
			() => {
				const formEl = document.querySelector(".wpcf7-form");
				const formData = new FormData(formEl);
				const objData = {};
				formData.forEach((value, key) => (objData[key] = value));
				if (!this.isBrandnewPackage() && this.isDealerCodeActive) {
					const data = this.jsonData.dealerCode.acf;
					async () => {
						if (data["google_sheet_id"] && data["google_sheet_script_code"]) {
							objData["googleSheetID"] = data["google_sheet_id"];
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
					};
				}
			},
			false
		);
	}

	createSelectbox() {
		const filterArr = this.wrapperArr.filter((e) => e.itemType == "selectbox");
		const createFn = (key, label) => {
			const container = this.container;
			container[key] = new SelectWrapper({
				update: (value, price) => {
					this.inputNodes[key].value = value;
					this.updatePrice(key, price);
				},
				onClick: () => {
					this.redraw();
				},
			});
			this.findWrapper(key).wrapper = new Wrapper({
				labelText: label,
			});
		};
		filterArr.forEach((e) => {
			createFn(e.key, e.label, e.update);
		});
	}

	refreshAddon(ignoreRadio) {
		const filterArr = this.wrapperArr.filter((e) => e.itemType == "selectbox" || e.itemType == "radio");

		const reFreshFn = (wrapper) => {
			const title = wrapper.key;
			const container = this.container[title];
			container.update(updateActiveItem(wrapper));
			this.findWrapper(title).wrapper.update(container.render());
		};

		const updateActiveItem = (wrapper) => {
			const title = wrapper.key;
			const json = this.jsonData;
			function filterTypeButtonAddonData(keyword, findID) {
				return filterAddonDataFn({ data: json[keyword], idArr: findID[keyword] });
			}

			let findID = wrapper.itemType == "selectbox" ? json.brandNewPackage.find((e) => e.title == this.activeItem.packageType) : json.car;
			return filterTypeButtonAddonData(title, findID);
		};

		filterArr.forEach((wrapper) => {
			if (wrapper.itemType == "selectbox") {
				if (this.isBrandnewPackage()) {
					reFreshFn(wrapper);
				} else {
					// 애드온 관련 데이터 리셋
					this.inputNodes[wrapper.key].value = "";
					this.updatePrice(wrapper.key, 0);
					this.findWrapper(wrapper.key).wrapper.DOM.innerHTML = "";
				}
			}
			if (wrapper.itemType == "radio" && !ignoreRadio) {
				reFreshFn(wrapper);
			}
		});
	}

	isBrandnewPackage() {
		return this.inputNodes.package.value == this.jsonData.brandNewPackageInfo.title;
	}

	// customize form 업데이트 관련
	refreshTypeButton() {
		const container = this.container.typeButton;
		// 신차 패키지
		if (this.isBrandnewPackage()) {
			const isTypeA = this.jsonData.car.acf.is_type_a;
			container.update(
				this.jsonData.brandNewPackage.map((r) => ({
					title: r.title,
					classType: r.classType,
					originPrice: isTypeA ? r.price.typeA : r.price.typeB,
					discountPrice: isTypeA ? r.price.typeA / 2 : r.price.typeB / 2,
				}))
			);
		} else {
			container.update(
				this.jsonData.dealerPackage.map((r) => ({
					title: r.title,
					originPrice: r.prices.origin,
					discountPrice: r.prices.discount,
				}))
			);
		}
		this.findWrapper("packageType").wrapper.update(container.render());
	}

	findWrapper(key) {
		const findedWrapper = this.wrapperArr.find((e) => e.key == key);
		return findedWrapper;
	}

	modelClickHandler() {
		this.inputNodes.model.addEventListener("input", async () => {
			this.jsonData.car = this.fetchWpJSON.findData("car").find((r) => this.inputNodes.model.value == r.title.rendered);
			this.refreshTypeButton();
			this.refreshAddon();
			this.redraw();
		});
	}

	redrawCustomzieDOM() {
		this.customizeDom.innerHTML = "";
		const activeWrappers = this.wrapperArr.filter((e) => e.wrapper);
		activeWrappers.forEach((e) => {
			if (e.wrapper.DOM.hasChildNodes()) {
				if (!e.wrapper.DOM.lastChild.classList.contains("contact-form__label")) {
					e.wrapper.appendTo(this.customizeDom);
				}
			}
		});
	}

	updatePrice(name, value) {
		this.wrapperArr.find((e) => e.key == name).value = Number(value);
	}

	updateReceipt() {
		const receiptDom = this.findWrapper("receipt").wrapper.DOM;
		const priceArr = this.wrapperArr.filter((e) => e.value);
		const totalPrice = priceArr.reduce((sum, item) => sum + item.value, 0);

		receiptDom.classList.add("contact-receipt");

		// reset wrapper inner
		receiptDom.innerHTML = "";
		this.inputNodes.totalPrice.value = totalPrice;

		const optionArr = [];

		const addonArr = this.wrapperArr.filter((e) => e.label);

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

		addonArr.forEach((e) => {
			if (this.inputNodes[e.key].value) {
				optionArr.push({
					title: e.label,
					content: this.inputNodes[e.key].value,
				});
			}
		});

		if (!this.isBrandnewPackage()) {
			optionArr.push({
				title: "블랙박스, 하이패스, 틴팅",
				content: "딜러가 지원합니다.",
			});

			optionArr.push({
				title: "담당 지점",
				content: this.dealerCodeObj.titleKr,
			});
		} else {
			optionArr.push({
				title: "프리미엄 케어",
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
