import Parallax from "../utils/parallax-effect";

export function aftercareParallax() {
	new Parallax({
		container: ".aftercare-card",
		content: ".aftercare-card__content",
		background: ".aftercare-card__background>.ct-image",
	});
}
