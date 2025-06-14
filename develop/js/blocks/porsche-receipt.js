import _ from "lodash";

export class PorcsheReceipt {
	constructor() {
		this.data = {
			model: "",
		};

		this.modelInput = document.querySelector('select[name="model"]');

		this.init();
	}

	init() {
		updateContact();
		this.observe(this.modelInput);
	}

	observe(el) {
		el.addEventListener("input", this.updateContact.bind(this));
	}

	updateContact() {
		this.data.model = this.modelInput.value;
		this.requestCarDate(this.data.model);
	}

	async requestCarDate(title) {
		try {
			// REST API 엔드포인트 생성
			const endpoint = `/porsche-dealer/wp-json/wp/v2/car?search=${encodeURIComponent(title)}`;

			// Fetch API로 요청
			const response = await fetch(endpoint);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// 응답 데이터(JSON) 파싱
			const posts = await response.json();

			// 검색 결과 처리
			if (posts.length > 0) {
				console.log(posts);
			} else {
				console.log("No posts found for the given title in Custom Post Type.");
				return null;
			}
		} catch (error) {
			console.error("Error fetching custom post:", error);
		}
	}
}
