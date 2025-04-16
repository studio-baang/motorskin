import Contact from "./pages/contact";
import { packagesInit } from "./pages/packages";
import { headerContorl } from "./pages/header";
import { aftercareParallax } from "./pages/aftercare";
import { smoothScroll } from "./utils/smooth-scroll";
import { createFranchisesMap } from "./pages/franchises";
import { debounce } from "lodash";
import { setVh } from "./utils/set-vh";
import { setServiceListAnim } from "./pages/home";
import { Faq } from "./pages/automotive";
import { introduceParallax } from "./pages/introduce";

class App {
	constructor() {
		this.body = document.querySelector("body");

		this.init();
		this.onLoad();
		this.onResize();
	}

	init() {
		document.addEventListener("DOMContentLoaded", () => {
			const main = document.querySelector("main");
			const namespace = main.dataset.namespace.toLowerCase() || null;
			if (namespace == "home") {
				setServiceListAnim();
			} else if (namespace == "packages") {
				packagesInit();
			} else if (namespace == "contact") {
				new Contact();
			} else if (namespace == "aftercare") {
				aftercareParallax();
			} else if (namespace == "franchises") {
				createFranchisesMap();
			} else if (namespace == "automotive") {
				new Faq();
			} else if (namespace == "motor skin") {
				introduceParallax();
			}
		});
	}

	onResize() {
		window.addEventListener("resize", debounce(setVh, 200));
	}

	onLoad() {
		document.addEventListener("DOMContentLoaded", () => {
			setVh();
			headerContorl();
			smoothScroll();
		});
	}
}
new App();
