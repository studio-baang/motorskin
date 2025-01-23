const main = document.querySelector("main");
const siteName = main.dataset.siteName;

function getSiteName() {
	if (!main) {
		console.error("cannot find main element");
		return false;
	}
	if (!siteName) {
		console.error("cannot find data-site-name in main element.");
		return false;
	}
	return siteName;
}

function isSiteBimmer() {
	if (siteName == "bimmer") {
		return true;
	}
	return false;
}

function isSitePanamera() {
	if (siteName == "panamera") {
		return true;
	}
	return false;
}

export { getSiteName, isSiteBimmer, isSitePanamera };
