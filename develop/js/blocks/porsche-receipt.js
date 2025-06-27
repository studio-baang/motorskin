import _ from "lodash";
import { requestWpJson } from "../utils/wp-json";
import { renderTypeButton } from "../components/contact-type-button";

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

		this.modelInput = document.querySelector('select[name="model"]');

		this.data = {
			model: this.modelInput.value,
		};

		this.carPost = null;

		this.onLoad();

		this.observe(this.modelInput);
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
		this.updateData();
		this.updateModelData();
	}

	updateData() {
		this.data.model = this.modelInput.value;
	}

	// 패키지 옵션 표기

	updateModelData() {
		requestWpJson(`/porsche-dealer/wp-json/wp/v2/car?search=${encodeURIComponent(this.data.model)}`, (posts) => {
			this.carPost = posts[0];
			this.renderTypeButton();
		});
	}

	updatePackageOption() {
		requestWpJson("/porsche-dealer/wp-json/wp/v2/package-option", (posts) => {
			this.packageOption = posts.map((e) => ({
				title: e.title.rendered,
				classType: e.acf.package_class,
				price: {
					typeA: e.acf.type_a,
					typeB: e.acf.type_b,
				},
			}));
		});
	}

	renderTypeButton() {
		const wrapper = document.getElementById("porsche-form__type-button-wrapper");
		// reset wrapper childe node
		wrapper.innerHTML = "";

		this.packageOption.forEach((content) => {
			const originPrice = this.carPost.acf.is_type_a ? content.price.typeA : content.price.typeB;

			wrapper.appendChild(
				renderTypeButton(
					{
						title: content.title,
						classType: content.classType,
						originPrice: originPrice,
						discountPrice: originPrice / 2,
					},
					false
				)
			);
		});
	}
}
