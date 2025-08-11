import { contactLabelDom } from "./contact-form-label";
import { createAddonContent } from "../utils/create-addon-content";

export class AddonSelectBox {
	/** 2개 이상 tintign 옵션이 있을 경우 select box를 렌더링합니다.
	 * @param {string} title 에드온 제목
	 * @param {Array} data 표시할 옵션 array */

	constructor(title, data) {
		this.fragment = document.createDocumentFragment();

		this.labelNode = contactLabelDom(title);

		this.selectNode = document.createElement("select");
		this.selectNode.classList.add("wpcf7-select");
		data.forEach((element) => {
			const optionContent = data.description ?? element.title;
			const option = new Option(optionContent);
			this.selectNode.appendChild(option);
		});
		this.selectNode.selectedIndex = 0;

		this.fragment.appendChild(this.labelNode);
		this.fragment.appendChild(this.selectNode);
	}
	render = () => {
		return this.fragment;
	};
}
