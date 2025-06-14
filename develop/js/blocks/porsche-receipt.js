import _ from "lodash";
import { getSiteName } from "../utils/filter-site-by-name";

export class PorcsheReceipt {
	constructor() {
		this.sitename = getSiteName();

		this.modelInput = document.querySelector('select[name="model"]');
		this.modelValue = this.modelInput.value;

		this.init();
	}

	init() {
		this.observe(this.modelInput);
	}

	observe(el) {
		el.addEventListener("input", this.updateContact.bind(this));
	}

	updateContact() {
		this.modelValue = this.modelInput.value;
		this.requestCarDate(this.modelValue);
	}

	async requestCarDate(title) {
		try {
			// REST API 엔드포인트 생성
			const endpoint = `/porche-dealer/wp-json/wp/v2/car?search=${encodeURIComponent(title)}`;

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
