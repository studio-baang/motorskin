import { debounce } from "lodash";
import { ServiceList } from "../blocks/serviceList";

export function setServiceListAnim() {
	const listItems = document.querySelectorAll(".service-list__item");

	const listAnimArr = [];

	if (listItems) {
		for (let i = 0; i < listItems.length; i++) {
			const listItem = listItems[i];
			const anim = new ServiceList(listItem);
			anim.resizeFunc();
			listAnimArr.push(anim);

			listItem.addEventListener("click", (e) => {
				const targetItem = listAnimArr.find((item) => item.el === e.currentTarget);
				const currentItem = listAnimArr.find((item) => item.isActive === true);

				listAnimArr.forEach((item) => (item.isActive = false));

				// 이전의 active 요소와 현재 active 요소가 같지 않다면 isActive를 활성화한다.
				if (targetItem !== currentItem) {
					targetItem.isActive = true;
				}

				// onClick 함수를 실행한다.
				listAnimArr.forEach((item) => item.onClick());
			});
		}

		window.addEventListener(
			"resize",
			debounce(() => {
				listAnimArr.forEach((item) => item.onResize());
			}, 150)
		);
	}
}
