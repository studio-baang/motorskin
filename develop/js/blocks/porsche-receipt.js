import _ from "lodash";
import { requestWpJson } from "../utils/wp-json";

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
		 * 			area-1 : number,
		 * 			area-2 : number
		 * 		}
		 *	}
		 */
		this.packageOption = [];
		this.modelInput = document.querySelector('select[name="model"]');

		this.init();

		this.carPost;
	}

	init() {
		this.runUpdatePipeline();
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
			console.log(this.carPost);
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
			console.log(this.packageOption);
		});
	}
}
