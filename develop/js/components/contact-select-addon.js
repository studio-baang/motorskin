import { contactLabelDOM } from "./contact-form-label";

export class AddonSelectBox {
	/** 2개 이상 tintign 옵션이 있을 경우 select box를 렌더링합니다.
	 * @param {string} label 에드온 제목
	 * @param {Array} data 표시할 옵션 array */

	constructor({ label = false, data }) {
		this.fragment = document.createDocumentFragment();
		this.init(label, data);
	}
	init(label, data) {
		if (label) {
			const labelNode = contactLabelDOM(this.labelContent);
			this.fragment.appendChild(labelNode);
		}

		const selectNode = document.createElement("select");
		selectNode.classList.add("wpcf7-select");
		data.forEach((element) => {
			const optionContent = data.description ?? element.title;
			const option = new Option(optionContent);
			selectNode.appendChild(option);
		});
		selectNode.selectedIndex = 0;

		this.fragment.appendChild(selectNode);
	}
	render = () => {
		return this.fragment;
	};
}
