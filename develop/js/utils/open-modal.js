export function openModdal() {
	const modalEls = [
		{
			name: "modal",
			item: document.querySelector(".modal") ?? false,
		},
		{
			name: "open-modal-button",
			item: document.querySelector(".open-modal-button") ?? false,
		},
	];

	toggleModal = () => {
		modalEls[0].item.classList.toggle("modal--open");
	};

	modalEls.forEach((el) => {
		el.item.addEventListener("click", toggleMoal());
	});
}
