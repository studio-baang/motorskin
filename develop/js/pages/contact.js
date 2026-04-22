import Swiper from "swiper";
import "swiper/modules/effect-fade.min.css";
import { Autoplay, EffectFade } from "swiper/modules";
import _ from "lodash";
import { ContactForm } from "../blocks/contact-form";

class Contact {
	constructor() {
		this.init();
	}

	init() {
		new Swiper(".contact-swiper", {
			modules: [Autoplay, EffectFade],
			loop: true,
			effect: "fade",
			speed: 750,
			autoplay: {
				delay: 2500,
			},
		});

		new ContactForm();
	}
}

export default Contact;
