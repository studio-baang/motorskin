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

		this.init();
	}

	init() {
		this.updatePackageOption();
		this.runUpdatePipeline();

		this.observe(this.modelInput);
	}

	observe(el) {
		el.addEventListener("input", this.runUpdatePipeline.bind(this));
	}

	runUpdatePipeline() {
		this.updateData();
		this.updatePackageType();
		this.renderTypeButton();
	}

	updateData() {
		this.data.model = this.modelInput.value;
	}

	// 패키지 옵션 표기

	updatePackageType() {
		requestWpJson(`car?search=${encodeURIComponent(this.data.model)}`, (posts) => {
			this.carPost = posts.find((post) => post.title.rendered === this.data.model);
		});
	}

	updatePackageOption() {
		requestWpJson("package-option", (posts) => {
			this.packageOption = posts.map((e) => ({
				title: e.title.rendered,
				class: e.acf.package_class,
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

		this.packageOption.forEach((data) => {
			wrapper.appendChild(renderTypeButton(data));
		});
	}
}
