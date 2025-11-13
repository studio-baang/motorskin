export async function sendToGoogleSheet({ googleScriptID, data }) {
	try {
		const response = await fetch(`https://script.google.com/macros/s/${googleScriptID}/exec`, {
			method: "POST",
			headers: { "Content-Type": "text/plain" },
			body: JSON.stringify(data),
			redirect: "follow",
		});
		const text = await response.text();

		if (text === "success") {
			console.log("문의가 전송되었습니다.");
		} else {
			console.error("문의 전송에 실패했습니다. - 처리 과정 중 에러");
		}
	} catch (error) {
		console.error("문의 전송에 실패했습니다. - 전송 중 에러");
	}
}
