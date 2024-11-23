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
			this.closeMenu();
		});
	}

	closeMenu() {
		const menuContainer = document.querySelector(".oxy-pro-menu-container");
		const menu = document.querySelector(".oxy-pro-menu");

		menuContainer.addEventListener("click", (e) => {
			const target = e.target;
			if (e.target.classList.contains("oxy-pro-menu-container")) {
				menu.classList.remove("oxy-pro-menu-open");
				document.querySelector(".oxy-pro-menu-container").classList.remove("oxy-pro-menu-open-container");
				const preventOverflows = document.querySelectorAll(".oxy-nav-menu-prevent-overflow");
				if (preventOverflows) {
					for (preventOverflows of item) {
						item.classList.remove("oxy-nav-menu-prevent-overflow");
					}
				}

				oxygen_pro_menu_unset_static_width(menu);
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
