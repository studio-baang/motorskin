export class TintingSelectBox {
	/** 2개 이상 tintign 옵션이 있을 경우 select box를 렌더링합니다.
	 * @param {Array} data 틴팅 json 정보를 가져옵니다 */

	constructor(data) {
		this.fragment = document.createDocumentFragment();

		this.labelNode = document.createElement("strong");
		this.labelNode.classList.add("contact-form__label");
		this.labelNode.innerText = "틴팅 선택";

		this.selectNode = document.createElement("select");
		this.selectNode.classList.add("wpcf7-select");
		data.forEach((element) => {
			const option = new Option(element.title, element.id);
			this.selectNode.appendChild(option);
		});

		this.fragment.appendChild(this.labelNode);
		this.fragment.appendChild(this.selectNode);
	}
	render = () => {
		return this.fragment;
	};
}
