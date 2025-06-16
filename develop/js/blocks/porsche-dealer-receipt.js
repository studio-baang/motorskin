import _ from "lodash";
import { requestWpJson } from "../utils/wp-json";
import { renderTypeButton } from "../components/contact-type-button";
import { toggleActiveClass } from "../utils/toggle-button";

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
			blackbox: this.inputNodes.blackbox.value,
		};

		this.packageTypeButtons = document.querySelectorAll(".contact-type-button");

		this.init();
	}

	init() {
		console.log(this.data);

		this.runUpdatePipeline();

		this.observe(this.inputNodes.model);
		this.observe(this.inputNodes.blackbox);

		this.packageTypeButtons.forEach((el) => {
			el.addEventListener("click", (e) => {
				const currentTarget = e.currentTarget;
				console.log(currentTarget);

				this.runUpdatePipeline.bind(this);
			});
		});
	}

	observe(el) {
		el.addEventListener("input", this.runUpdatePipeline.bind(this));
	}

	changePackageTypeData() {}

	runUpdatePipeline() {
		this.updateData();

		toggleActiveClass(this.packageTypeButtons, this.data.packageType, "contact-type-button__active");
	}

	updateData() {
		this.data = {
			model: this.inputNodes.model.value,
			packageType: this.inputNodes.packageType.value,
			blackbox: this.inputNodes.blackbox.value,
		};
	}
}
