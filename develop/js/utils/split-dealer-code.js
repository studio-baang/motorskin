export function splitDealerCode(inputData) {
	const len = inputData.length;

	if (len < 2) {
		return [inputData, ""]; // 문자열이 2자 이하인 경우
	}

	const splitPos = len - 2;

	const firstPart = inputData.substring(0, splitPos);
	const secondPart = parseInt(inputData.substring(splitPos), 10); // 문자열을 정수로 변환

	return {
		codeName: firstPart,
		codeNumber: secondPart,
	};
}
