import gsap from "gsap";
import Contact from "./pages/contact";
import Packages from "./pages/packages";
import RemoveDefaultClass from "./utils/removeDefaultClass";

class App {
	constructor() {
		this.body = document.querySelector("body");

		this.pageId = {
			packages: 15,
			contact: 38,
		};

		this.activePage = null;

		this.init();

		this.onLoad();
	}

	containsId(id) {
		return this.body.classList.contains("page-id-" + id);
	}

	init() {
		if (this.containsId(this.pageId.packages)) {
			this.activePage = new Packages();
			return false;
		}
		if (this.containsId(this.pageId.contact)) {
			this.activePage = new Contact();
			return false;
		}
	}

	onLoad() {
		document.addEventListener("DOMContentLoaded", () => {
			new RemoveDefaultClass();
			this.toggleGnbAnim();
			if (this.activePage.onLoad) {
				this.activePage.onLoad();
			}
		});
	}

	toggleGnbAnim() {
		const items = document.querySelectorAll(".header .menu-item");
		items.forEach((item) => {
			const animTarget = item.querySelector("a");
			const animation = gsap.to(animTarget, {
				paused: true,
				duration: 0.2,
				x: 20,
				ease: "power1.inOut",
			});

			item.addEventListener("mouseenter", () => animation.play());
			item.addEventListener("mouseleave", () => animation.reverse());
		});
	}
}
new App();
