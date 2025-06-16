import _ from "lodash";
import { requestWpJson } from "../utils/wp-json";
import { renderTypeButton } from "../components/contact-type-button";

export class PorcsheDearerReceipt {
	constructor() {
		this.inputNodes = {
			model: document.querySelector('select[name="model"]'),
			packageType: document.querySelector('input[name="package-type"]'),
			blackbox: document.querySelector('select[name="package-blackbox"]'),
		};

		this.data = {
			model: this.inputNodes.model.value,
			packageType: this.inputNodes.packageType.value,
			blackbox: this.inputNodes.black.value,
		};

		this.init();
	}

	init() {
		console.log(this.data);

		this.runUpdatePipeline();

		this.observe(this.modelInput);
	}

	observe(el) {
		el.addEventListener("input", this.runUpdatePipeline.bind(this));
	}

	runUpdatePipeline() {
		this.updateData();
	}

	updateData() {
		this.data.model = this.modelInput.value;
	}
}
