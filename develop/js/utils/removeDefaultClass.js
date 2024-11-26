function removeDivClass() {
	const div = document.querySelectorAll("div");
	div.forEach((elem) => {
		elem.classList.remove("ct-div-block");
	});
}
// 기본 section clss 삭제 메소드
function removeSectionClass() {
	const targets = [document.querySelectorAll("section"), document.querySelectorAll("footer")];

	targets.forEach((target) => {
		target.forEach((elem) => {
			elem.classList.remove("ct-section");
		});
	});
}
export function removeDefaultClass() {
	removeDivClass();
	removeSectionClass();
}
