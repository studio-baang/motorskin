import Contact from "./pages/contact";
import Packages from "./pages/packages";
import { headerContorl } from "./pages/header";
import { removeDefaultClass } from "./utils/removeDefaultClass";
import { aftercareParallax } from "./pages/aftercare";
import { smoothScroll } from "./utils/smooth-scroll";

class App {
	constructor() {
		this.body = document.querySelector("body");

		this.init();
		this.onLoad();
	}

	init() {
		const main = document.querySelector("main");
		const namespace = main.data("namespace");

		if (namespace == "package") {
			new Packages();
		} else if (namespace == "contact") {
			new Contact();
		} else if (namespace == "aftercare") {
			aftercareParallax();
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
