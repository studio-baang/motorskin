import _ from "lodash";

export class PorcsheReceipt {
	constructor() {
		this.data = {
			model: "",
		};

		this.modelInput = document.querySelector('select[name="model"]');

		this.init();

		this.carPost;
	}

	init() {
		this.runUpdatePipeline();
		this.observe(this.modelInput);
	}

	observe(el) {
		el.addEventListener("input", this.runUpdatePipeline.bind(this));
	}

	runUpdatePipeline() {
		this.updateData();
	}

	updateData() {
		this.data.model = this.modelInput.value;
		this.requestWpJson(`car?search=${encodeURIComponent(this.data.model)}`, (posts) => {
			this.carPost = posts.find((post) => post.title.rendered === this.data.model);
		});

		console.log(this.carPost);
	}

	async requestWpJson(url, returnFunc) {
		try {
			// REST API 엔드포인트 생성
			const endpoint = `/porsche-dealer/wp-json/wp/v2/${url}}`;

			// Fetch API로 요청
			const response = await fetch(endpoint);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// 응답 데이터(JSON) 파싱
			const posts = await response.json();

			// 검색 결과 처리
			if (posts.length > 0) {
				returnFunc(posts);
			} else {
				console.log("No posts found for the given title in Custom Post Type.");
				return null;
			}
		} catch (error) {
			console.error("Error fetching custom post:", error);
		}
	}
}
