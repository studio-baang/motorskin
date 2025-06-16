/**
 * contact의 커스텀 버튼의 active class를 입력된 value에 맞게 토글합니다.
 */
export function toggleActiveClass(els, activeValue, activeClassName) {
	els.forEach((el) => {
		el.classList.remove(activeClassName);
		if (el.dataset.content == activeValue) {
			el.classList.add(activeClassName);
		}
	});
	return false;
}
