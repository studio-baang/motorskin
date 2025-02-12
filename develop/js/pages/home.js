import { debounce } from "lodash";
import { ServiceList } from "../utils/serviceList";

export function setServiceListAnim() {
	const listItems = document.querySelectorAll(".service-list__item");

	const listAnimArr = [];

	if (listItems) {
		for (let i = 0; i < listItems.length; i++) {
			const listItem = listItems[i];
			const anim = new ServiceList(listItem);
			listAnimArr.push(anim);

			listItem.addEventListener(
				"click",
				(e) => {
					const targetItem = listAnimArr.find((item) => item.el === e.currentTarget);
					const currentItem = listAnimArr.find((item) => item.isCurrentActive === true);

					// 이전의 active 요소와 현재 active 요소가 같다면 모든 애니메이션을 리셋한다.
					if (targetItem == currentItem) {
						listAnimArr.forEach((item) => (item.isActive = false));
						targetItem.isCurrentActive = false;
					} else {
						// 그 외 상황이라면 모든 요소의 isActive를 true로 설정하고
						// target 개체를 표기하는 boolean을 설정한다.
						listAnimArr.forEach((item) => {
							item.isActive = true;
							item.isCurrentActive = false;
						});
						targetItem.isCurrentActive = true;
					}

					// onClick 함수를 실행한다.
					listAnimArr.forEach((item) => item.onClick());
				},
				true
			);
		}

		window.addEventListener(
			"resize",
			debounce(() => {
				listAnimArr.forEach((item) => item.onResize());
			}, 150)
		);
	}
}
