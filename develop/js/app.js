import Contact from "./pages/contact";
import Packages from "./pages/packages";
import { headerContorl } from "./pages/header";
import { aftercareParallax } from "./pages/aftercare";
import { smoothScroll } from "./utils/smooth-scroll";
import { createFranchisesMap } from "./pages/franchises";

class App {
	constructor() {
		this.body = document.querySelector("body");

		this.init();
		this.onLoad();
	}

	init() {
		const main = document.querySelector("main");
		const namespace = main.dataset.namespace.toLowerCase() || null;
		if (namespace == "packages") {
			new Packages();
		} else if (namespace == "contact") {
			new Contact();
		} else if (namespace == "aftercare") {
			aftercareParallax();
		} else if (namespace == "franchises") {
			createFranchisesMap();
		}
	}

	onLoad() {
		document.addEventListener("DOMContentLoaded", () => {
			headerContorl();
			smoothScroll();
		});
	}
}
new App();
