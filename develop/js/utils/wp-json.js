export async function requestWpJson(url) {
	try {
		// REST API 엔드포인트 생성
		const endpoint = url;

		// Fetch API로 요청
		const response = await fetch(endpoint);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// 응답 데이터(JSON) 파싱
		const posts = await response.json();

		// 검색 결과 처리
		if (posts.length > 0) {
			return posts;
		} else {
			console.log("404");
			return null;
		}
	} catch (error) {
		console.error("Error fetching custom post:", error);
	}
}
