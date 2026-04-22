import { sendToGoogleSheet } from "../../utils/sendToGoogleSheet";

export class MotorskinForm {
	constructor() {
		this.googleSheetNum = "AKfycbzbh5WMtq9MSeAaSiYcKADjP7V8R2rd_6UfQ9hPxA7HEjRW_uGMohmdLPYEv5hQ450";
		this.addSubmitEventListener();
	}

	addSubmitEventListener() {
		document.addEventListener(
			"wpcf7mailsent",
			async () => {
				const formEl = document.querySelector(".wpcf7-form");
				const formData = new FormData(formEl);
				const objData = {};
				formData.forEach((value, key) => (objData[key] = value));
				await sendToGoogleSheet({
					googleScriptID: this.googleSheetNum,
					data: objData,
				});
			},
			false,
		);
	}
}
