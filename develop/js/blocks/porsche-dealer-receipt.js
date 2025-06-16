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

		this.updateSelectData();

		this.observe(this.inputNodes.model, this.data.model);
		this.observe(this.inputNodes.blackbox, this.data.blackbox);

		this.packageTypeButtons.forEach((el) => {
			el.addEventListener("click", this.updatePackageTypeButton.bind(this));
		});
	}

	observe(el, data) {
		el.addEventListener("input", () => {
			this.updateSelectData(el, data);
		});
	}

	updatePackageTypeButton(e) {
		const currentTarget = e.currentTarget;
		const dataContent = currentTarget.dataset.content;

		this.inputNodes.packageType.value = _.escape(dataContent);
		this.data.packageType = this.inputNodes.packageType.value;

		toggleActiveClass(this.packageTypeButtons, this.data.packageType.value, "contact-type-button--active");

		renderReceipt();
	}

	updateSelectData(el, data) {
		data = el.value;

		renderReceipt();
	}

	renderReceipt() {
		console.log(this.data);
	}
}
