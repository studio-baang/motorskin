export class AddonSelectBox {
	/** 2개 이상 tintign 옵션이 있을 경우 select box를 렌더링합니다.
	 * @param {Array} data 표시할 옵션 array
	 * @param {string} title 에드온 제목 */

	constructor(data, title) {
		this.fragment = document.createDocumentFragment();

		this.labelNode = document.createElement("strong");
		this.labelNode.classList.add("contact-form__label");
		this.labelNode.innerText = title;

		this.selectNode = document.createElement("select");
		this.selectNode.classList.add("wpcf7-select");
		data.forEach((element) => {
			const option = new Option(element.title, element.title);
			this.selectNode.appendChild(option);
		});

		this.selectNode.addEventListener("input", (e) => {
			console.log(e.target);
		});

		this.fragment.appendChild(this.labelNode);
		this.fragment.appendChild(this.selectNode);
	}
	render = () => {
		return this.fragment;
	};
}
