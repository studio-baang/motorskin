// function closeMenu() {
// 	const menuContainer = document.querySelector(".oxy-pro-menu-container");
// 	const menu = document.querySelector(".oxy-pro-menu");

// 	menuContainer.addEventListener("click", (e) => {
// 		const target = e.target;
// 		if (e.target.classList.contains("oxy-pro-menu-container")) {
// 			menu.classList.remove("oxy-pro-menu-open");
// 			document.querySelector(".oxy-pro-menu-container").classList.remove("oxy-pro-menu-open-container");
// 			const preventOverflows = document.querySelectorAll(".oxy-nav-menu-prevent-overflow");
// 			for (const item of preventOverflows) {
// 				item.classList.remove("oxy-nav-menu-prevent-overflow");
// 			}

// 			oxygen_pro_menu_unset_static_width(menu);
// 		}
// 	});
// }

function toggleGnbItemAnim() {
	const gnbItems = document.querySelectorAll(".gnb__item");
	const activeClassName = "gnb__item--active";
	gnbItems.forEach((item) => {
		item.addEventListener("mouseenter", () => {
			gnbItems.forEach((el) => el.classList.remove(activeClassName));
			item.classList.add(activeClassName);
		});
	});
}

function toggleGnb() {
	const gnbEl = document.querySelector(".gnb");
	const headerIconEl = document.querySelector(".header-icon");
	const header = document.querySelector(".header");
	headerIconEl.addEventListener("click", (e) => {
		gnbEl.classList.toggle("gnb--active");
		headerIconEl.classList.toggle("header-icon--active");
		header, classList.toggle("heeder--gnb-active");
	});
}

export function headerContorl() {
	toggleGnbItemAnim();
	toggleGnb();
}
