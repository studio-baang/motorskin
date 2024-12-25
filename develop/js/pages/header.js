import gsap from "gsap";

function closeMenu() {
	const menuContainer = document.querySelector(".oxy-pro-menu-container");
	const menu = document.querySelector(".oxy-pro-menu");

	menuContainer.addEventListener("click", (e) => {
		const target = e.target;
		if (e.target.classList.contains("oxy-pro-menu-container")) {
			menu.classList.remove("oxy-pro-menu-open");
			document.querySelector(".oxy-pro-menu-container").classList.remove("oxy-pro-menu-open-container");
			const preventOverflows = document.querySelectorAll(".oxy-nav-menu-prevent-overflow");
			for (const item of preventOverflows) {
				item.classList.remove("oxy-nav-menu-prevent-overflow");
			}

			oxygen_pro_menu_unset_static_width(menu);
		}
	});
}

function toggleGnbAnim() {
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

export function headerContorl() {
	closeMenu();
	toggleGnbAnim();
}
