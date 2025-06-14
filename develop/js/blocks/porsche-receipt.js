import _ from "lodash";
import { requestWpJson } from "../utils/wp-json";
import { renderTypeButton } from "../components/contact-type-button";

export class PorcsheReceipt {
	constructor() {
		this.data = {
			model: "",
		};

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

		this.init();
	}

	init() {
		this.updateData();
		this.updatePackageType();
		this.updatePackageOption();

		this.observe(this.modelInput);
	}

	observe(el) {
		el.addEventListener("input", this.runUpdatePipeline.bind(this));
	}

	runUpdatePipeline() {
		this.updateData();
		this.updatePackageType();
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
		this.packageOption.forEach((e) => {
			renderTypeButton(e.title);
		});
	}
}
