import gsap from "gsap";
import { ignoreMobileHeaderWhenResizingWindow } from "../utils/resize-ignore-header";

export class ServiceList {
	constructor(el) {
		this.el = el;

		this.vw = window.innerWidth;
		this.breakPoint = 1024;
		this.isDesktop = this.vw > this.breakPoint ? true : false;

		this.contentWrapper = this.el.querySelector(".service-list__item-wrapper");
		this.title = this.el.querySelector(".service-list__title");
		this.desc = this.el.querySelector(".service-list__desc");

		this.mm = gsap.matchMedia();
		this.mmObj = {
			// set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
			isDesktop: `(min-width: ${this.breakPoint + 1}px)`,
			isMobile: `(max-width: ${this.breakPoint}px)`,
			reduceMotion: "(prefers-reduced-motion: reduce)",
		};

		this.titleFs = gsap.getProperty(this.title, "fontSize");

		this.itemWidth = "100%";
		this.activeWidth = "400%";

		this.itemMobileHeight = 600;

		this.duration = 0.4;

		this.isActive = false;

		this.onEnter = this.onEnter.bind(this);
		this.onLeave = this.onLeave.bind(this);

		this.elBasicGsap = {
			scale: 1,
			width: false,
			height: false,
			duration: this.duration,
			ease: "power2.inOut",
		};

		this.onResize();
	}

	enterAnim() {
		this.mm.add(this.mmObj, (context) => {
			let { isDesktop, reduceMotion } = context.conditions;
			gsap.to(this.el, {
				...this.elBasicGsap,
				width: false,
				scale: isDesktop ? 1.025 : 1,
			});
			gsap.to(this.contentWrapper, {
				opacity: this.isActive ? 0 : 1,
				duration: reduceMotion ? 0 : 0.4,
			});
			gsap.to(this.desc, {
				opacity: 0,
				duration: reduceMotion ? 0 : 0.4,
			});
		});
	}

	activeAnim() {
		this.mm.add(this.mmObj, (context) => {
			let { isDesktop, isMobile, reduceMotion } = context.conditions;
			gsap.to(this.el, {
				...this.elBasicGsap,
				width: isDesktop ? this.activeWidth : this.itemWidth,
				height: isMobile ? this.itemMobileHeight : false,
				duration: reduceMotion ? 0 : this.duration,
			});
			gsap.to(this.contentWrapper, {
				opacity: 1,
				duration: 0.4,
			});
			gsap.to(this.desc, {
				opacity: 1,
				display: "block",
				duration: 0.4,
				ease: "power4.in",
			});
		});
	}

	resetAnim() {
		this.mm.add(this.mmObj, (context) => {
			let { isMobile, reduceMotion } = context.conditions;
			gsap.to(this.el, {
				...this.elBasicGsap,
				width: this.itemWidth,
				height: isMobile ? "auto" : false,
				duration: reduceMotion ? 0 : this.duration,
			});
			gsap.to(this.contentWrapper, {
				opacity: this.isActive ? 0 : 1,
				duration: 0.4,
			});
			gsap.to(this.desc, {
				opacity: 0,
				display: "none",
				duration: 0.4,
			});
		});
	}

	onEnter() {
		this.enterAnim();
		this.el.removeEventListener("mouseenter", this.onEnter);
		this.el.addEventListener("mouseleave", this.onLeave);
	}

	onLeave() {
		this.resetAnim();
		this.el.removeEventListener("mouseleave", this.onLeave);
		this.el.addEventListener("mouseenter", this.onEnter);
	}

	onClick() {
		if (this.isActive) {
			this.el.removeEventListener("mouseenter", this.onEnter);
			this.el.removeEventListener("mouseleave", this.onLeave);
			this.activeAnim();
		} else {
			this.el.addEventListener("mouseenter", this.onEnter);
			this.resetAnim();
		}
	}

	resizeAnim() {
		this.isActive = false;

		gsap.killTweensOf(this.el);
		gsap.set(this.el, {
			clearProps: "all",
		});
		gsap.set(this.contentWrapper, {
			clearProps: "all",
		});
		gsap.set(this.desc, {
			clearProps: "all",
		});
	}

	onResize() {
		ignoreMobileHeaderWhenResizingWindow(() => {
			this.vw = window.innerWidth;
			this.isDesktop = this.vw > this.breakPoint ? true : false;

			this.resizeAnim();
			gsap.matchMediaRefresh();

			if (this.isDesktop) {
				this.el.addEventListener("mouseenter", this.onEnter);
			} else {
				this.el.removeEventListener("mouseenter", this.onEnter);
				this.el.removeEventListener("mouseleave", this.onLeave);
			}
		});
	}
}
