async function updateReceiptData(inputData) {
	try {
		// REST API 엔드포인트 생성
		const endpoint = `/${this.sitename ? this.sitename + "/" : ""}wp-json/wp/v2/dealer-code?search=${encodeURIComponent(title)}`;

		// Fetch API로 요청
		const response = await fetch(endpoint);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// 응답 데이터(JSON) 파싱
		const posts = await response.json();

		// 검색 결과 처리
		if (posts.length > 0) {
		} else {
			console.log("No posts found for the given title in Custom Post Type.");
			return null;
		}
	} catch (error) {
		console.error("Error fetching custom post:", error);
	}
}
