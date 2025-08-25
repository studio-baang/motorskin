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
		if (posts.length > 0 || typeof posts == "object") {
			return posts;
		} else {
			console.log("404");
			return null;
		}
	} catch (error) {
		console.error("Error fetching custom post:", error);
	}
}

export class WpJson {
	constructor(SITENAME, WPJSON) {
		this.wpJsonUrl = `${SITENAME}/${WPJSON}`;
		this.requests = [];
	}

	createRequest(name, url) {
		this.requests.push({ name, promise: fetch(this.wpJsonUrl + url).then((res) => res.json()) });
	}

	async requestData() {
		const results = await Promise.allSettled(this.requests.map((r) => r.promise));

		this.successData = results
			.filter((r) => r.status === "fulfilled")
			.map((r, i) => ({
				name: this.requests[i].name,
				data: r.value,
			}));

		const errors = results
			.filter((r) => r.status === "rejected")
			.map((r, i) => ({
				name: this.requests[i].name,
				data: r.value,
			}));
	}

	findData(name) {
		let data = this.successData.find((r) => r.name == name).data;
		if (Array.isArray(data) && data.length == 1) {
			data = data[0];
		}
		return data;
	}
}
