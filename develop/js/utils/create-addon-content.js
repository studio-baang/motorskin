/**
 * 추가금이 있는 텍스트에 (+추가금)을 붙이는 함수
 * @param {*} basis
 * @param {*} price
 * @returns
 */

export function createAddonContent(basis, price) {
	let content = basis;
	// 추가 금액이 있을 시 옵션에 추가
	if (price !== 0) {
		content += " (";
		if (price > 0) {
			content += "+";
		}
		content += price.toLocaleString("ko-KR");
		content += "원)";
	}

	return content;
}
