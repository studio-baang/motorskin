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
	if (this.siteName == "bimmer") {
		console.log("bimmer");
		return true;
	}
	return false;
}

function isSitePanamera() {
	if (this.siteName == "panamera") {
		return true;
	}
	return false;
}

export { getSiteName, isSiteBimmer, isSitePanamera };
