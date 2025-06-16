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

		this.handleSelectBox();

		this.observe("model");
		this.observe("blackbox");

		this.packageTypeButtons.forEach((el) => {
			el.addEventListener("click", this.handlePackageTypeButton.bind(this));
		});
	}

	observe(el, data) {
		el.addEventListener("input", () => {
			this.handleSelectBox(el, data);
		});
	}

	handlePackageTypeButton(e) {
		console.log(e);

		const button = e.currentTarget;
		const selectedValue = button.dataset.content;

		if (!selectedValue) return; // 안정성 체크

		this.inputNodes.packageType.value = selectedValue;
		this.data.packageType = this.inputNodes.packageType.value;

		toggleActiveClass(this.packageTypeButtons, this.data.packageType.value, "contact-type-button--active");

		renderReceipt();
	}

	handleSelectBox(key) {
		const value = this.inputNodes[key].value;
		this.data[key] = value; // 내부 상태 업데이트

		renderReceipt();
	}

	renderReceipt() {
		console.log(this.data);
	}
}
