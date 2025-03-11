export class Faq {
	constructor() {
		this.items = document.querySelectorAll(".faq__item");

		document.addEventListener("DOMContentLoaded", this.init);
	}
	init = (e) => {
		console.log("waht");

		this.onLoad();
		this.items.forEach((item) => {
			item.addEventListener("click", this.onClick);
		});
	};
	onLoad() {}
	onClick = (e) => {
		const curTarget = e.currentTarget;
		const targetExpanded = curTarget.getAttribute("aria-expanded");

		this.items.forEach((item) => {
			item.setAttribute("aria-expanded", false);
		});
		if (targetExpanded == "false") {
			curTarget.setAttribute("aria-expanded", true);
		}
	};
}
