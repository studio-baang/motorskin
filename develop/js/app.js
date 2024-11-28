import Contact from "./pages/contact";
import Packages from "./pages/packages";
import { headerContor } from "./pages/header";
import { removeDefaultClass } from "./utils/removeDefaultClass";
import { aftercareParallax } from "./pages/aftercare";
import { smoothScroll } from "./utils/smooth-scroll";

class App {
	constructor() {
		this.body = document.querySelector("body");

		this.pageId = {
			package: 15,
			contact: 38,
			aftercare: 161,
		};

		this.init();
		this.onLoad();
	}

	containsId(id) {
		return this.body.classList.contains("page-id-" + id);
	}

	init() {
		if (this.containsId(this.pageId.package)) {
			new Packages();
		} else if (this.containsId(this.pageId.contact)) {
			new Contact();
		} else if (this.containsId(this.pageId.aftercare)) {
			aftercareParallax();
		}
	}

	onLoad() {
		document.addEventListener("DOMContentLoaded", () => {
			headerContor();
			smoothScroll();
		});
	}
}
new App();
