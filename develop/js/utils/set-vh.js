let lastHeight = window.innerHeight;
const IGNORE_THRESHOLD = 50; // 50px 이하의 변화는 무시

export function setVh() {
	let newHeight = window.innerHeight;

	// 특정 임계값 이하의 리사이징이면 무시
	if (Math.abs(newHeight - lastHeight) <= IGNORE_THRESHOLD) return;

	let vh = newHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
	lastHeight = newHeight; // 높이 갱신
}
