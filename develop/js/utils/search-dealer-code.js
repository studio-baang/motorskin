function splitDealerCode(inputData) {
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

export async function searchDealerCode(dealerCode, callbackFn, errorFn) {
	const dealerCodeData = splitDealerCode(dealerCode);

	// search dealer code data
	const searchCode = await requestWpJson(`/porsche-dealer/wp-json/wp/v2/dealer-code?aW50ZXJuYWw=true&search=${dealerCodeData.codeName}`);

	if (searchCode) {
		const searchCodeData = searchCode[0];
		const rangeNum = Number(searchCodeData.acf.range);

		if (dealerCodeData.codeNumber > 0 && dealerCodeData.codeNumber <= rangeNum) {
			const data = {
				titleEn: searchCodeData.acf.title_en,
				titleKr: searchCodeData.acf.title_kr,
				googleSheetID: searchCodeData.acf.google_sheet_id,
				dealerCode: dealerCode,
			};
			callbackFn(data);
		} else {
			errorFn();
		}
	} else {
		errorFn();
	}
}
