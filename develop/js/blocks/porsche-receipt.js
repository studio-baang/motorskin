import _ from "lodash";
import tintingJSON from "../data/tinting.json" assert { type: "json" };

import { requestWpJson } from "../utils/wp-json";

import { renderReceipt } from "../components/contact-receipt";
import { TypeButton } from "../components/contact-type-button";

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
			tinting: document.querySelector('input[name="tintting"]'),
		};

		this.packagePrice = 0;

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
			});

			if (typeButton.content.title === this.packageOption[0].title) {
				typeButton.onActiveState();
				this.updateTypeButtonData(typeButton.content.title, typeButton.content.discountPrice);
			}

			this.typeButtons.push(typeButton);
			this.clickTypeButtonsHandler(content);

			wrapper.appendChild(typeButton.render());
		});
	}

	clickTypeButtonsHandler(content) {
		this.typeButtons.forEach((typeButton) => {
			typeButton.element.addEventListener("click", (e) => {
				// remove active button
				this.typeButtons.forEach((typeButton) => {
					typeButton.offActiveState();
				});

				if (e.currentTarget === typeButton.element) {
					typeButton.onActiveState();
					this.updateTypeButtonData(typeButton.content.title, typeButton.content.discountPrice);

					// filter tinting data
					this.filteredTintingData = this.filterAddonData(tintingJSON, content.tinting);

					console.log(tintingJSON, content.tinting);

					this.redrawReceipt();
				}
			});
		});
	}

	updateTypeButtonData(title, price) {
		this.inputNodes.packageType.value = title;
		this.packagePrice = price;
	}

	filterAddonData(originalData, contentData) {
		return originalData.filter((item) => contentData.includes(item.id));
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
					content: 'this.inputNodes.value("blackbox")',
				},
				{
					title: "틴팅",
					content: "후퍼옵틱 GK",
				},
				{
					title: "프리미엄 케어",
				},
			],
			this.packagePrice
		);

		wrapper.appendChild(element);
	}
}
