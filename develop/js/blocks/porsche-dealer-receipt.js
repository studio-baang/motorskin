import _ from "lodash";
import { requestWpJson } from "../utils/wp-json";
import { renderTypeButton } from "../components/contact-type-button";
import { toggleActiveClass } from "../utils/toggle-button";
import { renderReceipt } from "../components/contact-receipt";

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

		this.optionContents = [
			{
				title: "전체 PPF 시공",
				content: "루프 제외 모든 도장면에 시공되는 품목입니다.",
			},
			{
				title: "블랙박스",
				content: this.data.blackbox,
			},
			{
				title: "썬팅",
				content: "후퍼옵틱 GK",
			},
			{
				title: "하이패스",
				content: "기본 포함",
			},
		];

		this.packageTypeButtons = document.querySelectorAll(".contact-type-button");

		this.init();
	}

	init() {
		console.log(this.data);

		this.observe("model");
		this.observe("blackbox");

		this.packageTypeButtons.forEach((el) => {
			el.addEventListener("click", this.handlePackageTypeButton.bind(this));
		});
	}

	observe(key) {
		this.inputNodes[key].addEventListener("input", () => {
			this.handleSelectBox(key);
		});
	}

	handlePackageTypeButton(e) {
		const button = e.currentTarget;
		const selectedValue = button.dataset.content;

		if (!selectedValue) return; // 안정성 체크

		this.inputNodes.packageType.value = selectedValue;
		this.data.packageType = this.inputNodes.packageType.value;

		toggleActiveClass(this.packageTypeButtons, this.data.packageType, "contact-type-button--active");

		this.redrawReceipt();
	}

	handleSelectBox(key) {
		const value = this.inputNodes[key].value;
		this.data[key] = value; // 내부 상태 업데이트

		this.redrawReceipt();
	}

	redrawReceipt() {
		const wrapper = document.getElementById("contact-receipt");
		// reset wrapper inner
		wrapper.innerHTML = "";

		const element = renderReceipt(
			{
				modelName: this.data.model,
				packageName: this.data.packageType,
			},
			[
				{
					title: "전체 PPF 시공",
					content: "루프 제외 모든 도장면에 시공되는 품목입니다.",
				},
				{
					title: "블랙박스",
					content: this.data.blackbox,
				},
				{
					title: "썬팅",
					content: "후퍼옵틱 GK",
				},
				{
					title: "하이패스",
					content: "기본 포함",
				},
			]
		);

		wrapper.appendChild(element);
	}
}
