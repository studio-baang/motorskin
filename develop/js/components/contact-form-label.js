export function contactLabelDOM(title) {
	const labelDom = document.createElement("strong");
	labelDom.classList.add("contact-form__label");
	labelDom.innerText = title;

	return labelDom;
}
