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
			totalPrice: document.querySelector('input[name="total-price"]'),
			dealerCode: document.querySelector('input[name="code"]'),
			value(key) {
				if (typeof key === "string") {
					return this[key]?.value ?? null;
				}
				return false;
			},
		};

		this.price = [
			{ key: "카바차 3.0 PPF", value: 5000000 },
			{ key: "모터가드 PPF", value: 4500000 },
			{ key: "글로벌 PPF", value: 3900000 },
		];

		this.totalPrice = this.findPrice();

		this.packageTypeButtons = document.querySelectorAll(".contact-type-button");

		this.init();
	}

	init() {
		this.observe("model");
		this.observe("blackbox");

		this.packageTypeButtons.forEach((el) => {
			el.addEventListener("click", this.handlePackageTypeButton.bind(this));
		});

		this.redrawReceipt();
	}

	observe(key) {
		this.inputNodes[key].addEventListener("input", () => {
			this.redrawReceipt();
		});
	}

	handlePackageTypeButton(e) {
		const button = e.currentTarget;
		const selectedValue = button.dataset.content;

		if (!selectedValue) return; // 안정성 체크

		this.inputNodes.packageType.value = selectedValue;

		toggleActiveClass(this.packageTypeButtons, this.packageType.value, "contact-type-button--active");

		// reduce total Price
		this.totalPrice = this.findPrice();
		this.inputNodes.totalPrice.value = this.totalPrice;

		this.redrawReceipt();
	}
	findPrice() {
		const findPrice = this.price.find((p) => p.key == this.packageType.value);

		return findPrice.value;
	}

	redrawReceipt() {
		const wrapper = document.getElementById("contact-receipt");
		// reset wrapper inner
		wrapper.innerHTML = "";

		const element = renderReceipt(
			{
				modelName: this.inputNodes.value("model"),
				packageName: this.inputNodes.value("packageType"),
			},
			[
				{
					title: "전체 PPF 시공",
					content: "루프 제외 모든 도장면에 시공되는 품목입니다.",
				},
				{
					title: "블랙박스",
					content: this.inputNodes.value("blackbox"),
				},
				{
					title: "썬팅",
					content: "후퍼옵틱 GK",
				},
				{
					title: "하이패스",
					content: "기본 포함",
				},
			],
			this.totalPrice,
			{
				dealerCodeValue: this.dealerCode.value,
			}
		);

		wrapper.appendChild(element);
	}
}
