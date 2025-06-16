function renderOptionListItem(title, description) {
	const element = document.createElement("li");
	element.innerHTML = `<li class="contact-receipt__options-list">
							<h5>${title}</h5>
							<p>${description}</p>
						</li>`;
	return element;
}

function renderSubIndex(content) {
	const element = document.createElement("span");
	element.classList.add("contact-receipt__index");
	element.textContent = content;

	return element;
}

function renderHead(modelName, packageName) {
	// render wrapper
	const wrapper = document.createElement("div");
	wrapper.classList.add("contact-receipt__head");

	wrapper.appendChild(renderSubIndex("시공 미리보기"));

	// render model name as title
	const titleEl = document.createElement("h3");
	titleEl.classList.add("contact-receipt__title");
	titleEl.textContent = modelName;
	wrapper.appendChild(titleEl);

	// render package name
	const packageNameEl = document.createElement("p");
	packageNameEl.textContent = packageName;
	wrapper.appendChild(packageNameEl);

	return wrapper;
}

function renderOptionList() {
	// render wrapper
	const wrapper = document.createElement("div");
	wrapper.classList.add("contact-receipt__container");

	wrapper.appendChild(renderSubIndex("기본 사향"));

	return wrapper;
}

/**
 *
 * @param {object} headObj
 * @param {string} headObj.modelName 모델명
 * @param {string} headObj.packageName 패키지명
 * @param {Array} optionlist
 * @returns
 */
export function renderReceipt(headObj, optionlist) {
	const { modelName, packageName } = headObj;

	const element = document.createElement("div");
	element.classList.add("contact-receipt");

	// render head
	element.appendChild(renderHead(modelName, packageName));

	// element.innerHTML = `<div class="contact-receipt__head">
	// 	<span class="contact-receipt__index">시공 미리보기</span>
	// 	<h3 id="contact-receipt-title" class="contact-receipt__title">모델명</h3>
	// 	<p id="contact-receipt-promotion"></p>
	// </div>
	// <div class="contact-receipt__container">
	// 	<span class="contact-receipt__index">기본 사항</span>
	// 	<ul class="contact-receipt__options" id="contact-receipt__options">
	// 	</ul>
	// </div>
	// <div class="contact-receipt__quotation">
	// 	<span class="contact-receipt__index">예상 견적</span>
	// 	<span class="contact-receipt__payment"><strong id="contact-receipt-amount">0</strong>원 ~</span>
	// 	<span class="contact-receipt__info">모든 패키지 금액은 부가가치세(VAT) 별도입니다.</span>
	// </div>`;

	return element;
}
