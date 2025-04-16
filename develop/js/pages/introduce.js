import Parallax from "../utils/parallax-effect";

export function introduceParallax() {
	new Parallax({
		container: ".introduce-frame",
		background: ".introduce-frame__background>.ct-image",
	});
}
