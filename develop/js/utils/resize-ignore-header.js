let lastHeight = window.innerHeight;
const IGNORE_THRESHOLD = 50; // 50px 이하의 변화는 무시

export function ignoreMobileHeaderWhenResizingWindow(func) {
	let newHeight = window.innerHeight;

	// 특정 임계값 이하의 리사이징이면 무시
	if (Math.abs(newHeight - lastHeight) <= IGNORE_THRESHOLD) return;

	func();
	lastHeight = newHeight; // 높이 갱신
}
