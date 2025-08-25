import { requestWpJson } from "./wp-json";

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

export function checkDealerCode(dealerCode, data) {
	const dealerCodeObj = splitDealerCode(dealerCode);
	if (data.length <= 0) {
		return false;
	}
	const acf = data.acf;
	const rangeNum = Number(acf.range);
	if (dealerCodeObj.codeNumber > 0 && dealerCodeObj.codeNumber <= rangeNum) {
		return true;
	} else {
		return false;
	}
}

export async function searchDealerCode(dealerCode, callbackFn, errorFn) {
	const dealerCodeData = splitDealerCode(dealerCode);

	// search dealer code data
	const searchCode = await requestWpJson(`/porsche-dealer/wp-json/wp/v2/dealer-code?aW50ZXJuYWw=true&search=${dealerCodeData.codeName}`);

	if (searchCode && searchCode.length > 0) {
		const searchCodeData = searchCode[0];
		const rangeNum = Number(searchCodeData.acf.range);

		if (dealerCodeData.codeNumber > 0 && dealerCodeData.codeNumber <= rangeNum) {
			const data = {
				titleEn: searchCodeData.acf.title_en,
				titleKr: searchCodeData.acf.title_kr,
				googleSheetID: searchCodeData.acf.google_sheet_id,
				googleSheetScriptCode: searchCodeData.acf.google_sheet_script_code,
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
