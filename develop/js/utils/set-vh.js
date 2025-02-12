import { ignoreMobileHeaderWhenResizingWindow } from "./resize-ignore-header";

export function setVh() {
	ignoreMobileHeaderWhenResizingWindow(() => {
		document.documentElement.style.setProperty("--vh", `${vh}px`);
	});
}
