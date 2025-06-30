import _ from "lodash";
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
		};

		this.typeButtons = [];

		this.carData = null;

		this.onLoad();

		this.observe(this.inputNodes.model);
	}

	onLoad() {
		// json으로 모델과 관련된 정보를 수집
		this.updatePackageOption();
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
				this.inputNodes.packageType.value = typeButton.content.title;
			}

			this.typeButtons.push(typeButton);
			this.clickTypeButtonsHandler();

			wrapper.appendChild(typeButton.render());
		});
	}

	clickTypeButtonsHandler() {
		this.typeButtons.forEach((typeButton) => {
			typeButton.element.addEventListener("click", (e) => {
				this.typeButtons.forEach((typeButton) => {
					typeButton.offActiveState();
				});

				if (e.currentTarget === typeButton.element) {
					typeButton.onActiveState();
					this.inputNodes.packageType.value = typeButton.content.title;

					this.redrawReceipt();
				}
			});
		});
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
			this.totalPrice
		);

		wrapper.appendChild(element);
	}
}
