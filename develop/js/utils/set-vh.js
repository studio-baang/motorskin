import { ignoreMobileHeaderWhenResizingWindow } from "./resize-ignore-header";

export function setVh() {
	ignoreMobileHeaderWhenResizingWindow(() => {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	});
}
