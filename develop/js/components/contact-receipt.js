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

function renderOptionList(optionlist) {
	// render wrapper
	const wrapper = document.createElement("div");
	wrapper.classList.add("contact-receipt__container");
	wrapper.appendChild(renderSubIndex("기본 사항"));

	// render ul
	const ul = document.createElement("ul");
	ul.classList.add("contact-receipt__options");

	optionlist.forEach((el) => {
		ul.appendChild(renderOptionListItem(el.title, el.content));
	});

	wrapper.appendChild(ul);

	return wrapper;
}

function renderQuotation(priceValue) {
	const wrapper = document.createElement("div");
	wrapper.classList.add("contact-receipt__quotation");
	wrapper.appendChild(renderSubIndex("예상 견적"));

	const paymentEl = document.createElement("span");
	paymentEl.classList.add("contact-receipt__payment");
	if (priceValue) {
		const priceLocal = priceValue.toLocaleString("ko-KR");
		paymentEl.innerHTML = `<strong id="contact-receipt-amount">${priceLocal}</strong>원 ~`;
	}
	wrapper.appendChild(paymentEl);

	const infoEl = document.createElement("span");
	infoEl.classList.add("contact-receipt__info");
	infoEl.textContent = "모든 패키지 금액은 부가가치세(VAT) 별도입니다.";
	wrapper.appendChild(infoEl);

	return wrapper;
}

function renderDealerCode(codeValue) {
	// render wrapper
	const element = document.createElement("div");
	element.classList.add("contact-receipt__dealer-code");
	element.appendChild(renderSubIndex("딜러코드"));

	const content = element.createElement("p");
	content.textContent = codeValue;
	element.appendChild(content);

	return element;
}

/**
 *
 * @param {object} headObj
 * @param {string} headObj.modelName 모델명
 * @param {string} headObj.packageName 패키지명
 * @param {Array} optionlist 옵션 리스트 배열
 * @param {number} priceValue 최종 결과 값
 * @returns
 */
export function renderReceipt(headObj, optionlist, priceValue, ...otherOption) {
	const { modelName, packageName } = headObj;

	const fragment = document.createDocumentFragment();

	// render head
	fragment.appendChild(renderHead(modelName, packageName));

	// render Option
	fragment.appendChild(renderOptionList(optionlist));

	if (otherOption && otherOption.dealerCodeValue) {
		fragment.appendChild(renderDealerCode(otherOption.dealerCodeValue));
	}

	// render quotation
	fragment.appendChild(renderQuotation(priceValue));

	return fragment;
}
