import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

class Parallax {
	/**
	 * @typedef {Object} parallaxSelector
	 * @property {string} container 추적할 selector 지정
	 * @property {string} content content selector 지정
	 * @property {string} background background selector 지정
	 */

	/**
	 * parallax effect 생성 클래스
	 * @param {parallaxSelector} selectors 이펙트를 넣을 dom을 지정

	 */
	constructor(selectors) {
		this.data = {
			container: selectors.container,
			background: selectors.background,
			content: selectors.content,
		};

		this.init();
	}
	init() {
		if (this.data.container) {
			gsap.utils.toArray(this.data.container).forEach((container) => {
				const ct = container.querySelector(this.data.content);
				const bg = container.querySelector(this.data.background);

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: container,
						scrub: true,
						pin: false,
					},
				});

				if (bg) {
					tl.fromTo(
						bg,
						{
							yPercent: -30,
							ease: "none",
						},
						{
							yPercent: 30,
							ease: "none",
						}
					);
				}

				if (ct) {
					tl.to(
						ct,
						{
							yPercent: -100,
							ease: "none",
						},
						"<"
					);
				}
			});
		}
	}
}

export default Parallax;
