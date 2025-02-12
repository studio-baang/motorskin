export function openInfoModdal() {
	const modalEls = [
		{
			name: "modal",
			item: document.querySelector(".info-modal") ?? false,
		},
		{
			name: "open-modal-button",
			item: document.querySelector(".info-modal-triggner") ?? false,
		},
	];

	toggleModal = () => {
		modalEls[0].item.classList.toggle("modal--open");
	};

	modalEls.forEach((el) => {
		if (el.itme) {
			el.item.addEventListener("click", toggleMoal());
		}
	});
}
