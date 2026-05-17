export class QuickMenu {
	static storageKey = "quick-menu-position";
	static dragThreshold = 6;
	static instances = new WeakMap();

	constructor(menu) {
		if (!menu || QuickMenu.instances.has(menu)) {
			return QuickMenu.instances.get(menu);
		}

		this.menu = menu;
		this.toggle = menu.querySelector(".quick-menu__toggle");
		this.items = Array.from(menu.querySelectorAll(".quick-menu__item"));
		this.drag = {
			active: false,
			moved: false,
			pointerId: null,
			startX: 0,
			startY: 0,
			originX: 0,
			originY: 0,
		};

		if (!this.toggle) {
			return;
		}

		QuickMenu.instances.set(menu, this);
		this.init();
	}

	init() {
		var bounds = this.getBounds();
		var stored = this.getStoredPosition();

		this.setPosition(stored || { x: bounds.maxX, y: bounds.maxY });
		this.bindEvents();
	}

	bindEvents() {
		this.toggle.addEventListener("pointerdown", this.handlePointerDown.bind(this));
		this.toggle.addEventListener("pointermove", this.handlePointerMove.bind(this));
		this.toggle.addEventListener("pointerup", this.handlePointerUp.bind(this));
		this.toggle.addEventListener("pointercancel", this.handlePointerCancel.bind(this));

		this.items.forEach((item) => {
			item.addEventListener("click", () => {
				this.setOpen(false);
			});
		});

		document.addEventListener("pointerdown", this.handleOutsidePointerDown.bind(this));
		document.addEventListener("keydown", this.handleKeyDown.bind(this));
		window.addEventListener("resize", this.handleResize.bind(this));
	}

	handlePointerDown(event) {
		if (event.button !== undefined && event.button !== 0) {
			return;
		}

		var position = this.getPosition();

		this.drag.active = true;
		this.drag.moved = false;
		this.drag.pointerId = event.pointerId;
		this.drag.startX = event.clientX;
		this.drag.startY = event.clientY;
		this.drag.originX = position.x;
		this.drag.originY = position.y;

		this.toggle.setPointerCapture(event.pointerId);
	}

	handlePointerMove(event) {
		if (!this.drag.active || event.pointerId !== this.drag.pointerId) {
			return;
		}

		var deltaX = event.clientX - this.drag.startX;
		var deltaY = event.clientY - this.drag.startY;
		var distance = Math.hypot(deltaX, deltaY);

		if (distance <= QuickMenu.dragThreshold && !this.drag.moved) {
			return;
		}

		this.drag.moved = true;
		this.menu.classList.add("quick-menu__root--dragging");
		this.setOpen(false);
		this.setPosition({
			x: this.drag.originX + deltaX,
			y: this.drag.originY + deltaY,
		});
	}

	handlePointerUp(event) {
		if (!this.drag.active || event.pointerId !== this.drag.pointerId) {
			return;
		}

		this.drag.active = false;
		this.menu.classList.remove("quick-menu__root--dragging");

		try {
			this.toggle.releasePointerCapture(event.pointerId);
		} catch (error) {
			// Pointer capture may already be released by the browser.
		}

		if (this.drag.moved) {
			this.snapToCorner();
			return;
		}

		this.setOpen(!this.menu.classList.contains("quick-menu__root--open"));
	}

	handlePointerCancel() {
		if (!this.drag.active) {
			return;
		}

		this.drag.active = false;
		this.menu.classList.remove("quick-menu__root--dragging");
		this.snapToCorner();
	}

	handleOutsidePointerDown(event) {
		if (!this.menu.classList.contains("quick-menu__root--open") || this.menu.contains(event.target)) {
			return;
		}

		this.setOpen(false);
	}

	handleKeyDown(event) {
		if (event.key === "Escape") {
			this.setOpen(false);
		}
	}

	handleResize() {
		this.setPosition(this.getPosition());
		this.snapToCorner();
	}

	numberFromCss(value, fallback) {
		var parsed = parseFloat(value);
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	getConfig() {
		var style = window.getComputedStyle(this.menu);

		return {
			size: this.numberFromCss(style.getPropertyValue("--quick-menu-size"), 56),
			itemSize: this.numberFromCss(style.getPropertyValue("--quick-menu-item-size"), 56),
			gap: this.numberFromCss(style.getPropertyValue("--quick-menu-gap"), 10),
			sideOffset: this.numberFromCss(style.getPropertyValue("--quick-menu-side-offset"), 16),
			bottomOffset: this.numberFromCss(style.getPropertyValue("--quick-menu-bottom-offset"), 18),
			topOffset: this.numberFromCss(style.getPropertyValue("--quick-menu-top-offset"), 16),
		};
	}

	getBounds() {
		var config = this.getConfig();

		return {
			minX: config.sideOffset,
			maxX: window.innerWidth - config.size - config.sideOffset,
			minY: config.topOffset,
			maxY: window.innerHeight - config.size - config.bottomOffset,
			config: config,
		};
	}

	getStoredPosition() {
		try {
			var value = window.localStorage.getItem(QuickMenu.storageKey);

			if (!value) {
				return null;
			}

			var parts = value.split(",");
			var x = parseFloat(parts[0]);
			var y = parseFloat(parts[1]);

			if (!Number.isFinite(x) || !Number.isFinite(y)) {
				return null;
			}

			return { x: x, y: y };
		} catch (error) {
			return null;
		}
	}

	storePosition(position) {
		try {
			window.localStorage.setItem(QuickMenu.storageKey, position.x + "," + position.y);
		} catch (error) {
			return;
		}
	}

	clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	setPosition(position) {
		var bounds = this.getBounds();
		var x = this.clamp(position.x, bounds.minX, bounds.maxX);
		var y = this.clamp(position.y, bounds.minY, bounds.maxY);

		this.menu.style.transform = "translate3d(" + x + "px, " + y + "px, 0)";
		this.menu.dataset.x = String(x);
		this.menu.dataset.y = String(y);
		this.updatePlacement({ x: x, y: y });
	}

	getPosition() {
		var x = parseFloat(this.menu.dataset.x);
		var y = parseFloat(this.menu.dataset.y);

		if (Number.isFinite(x) && Number.isFinite(y)) {
			return { x: x, y: y };
		}

		var bounds = this.getBounds();
		return { x: bounds.maxX, y: bounds.maxY };
	}

	updatePlacement(position) {
		var bounds = this.getBounds();
		var config = bounds.config;
		var centerX = position.x + config.size / 2;
		var centerY = position.y + config.size / 2;
		var edge = centerX < window.innerWidth / 2 ? "left" : "right";
		var direction = centerY < window.innerHeight / 2 ? "down" : "up";

		this.menu.classList.toggle("quick-menu__root--edge-left", edge === "left");
		this.menu.classList.toggle("quick-menu__root--edge-right", edge === "right");
		this.menu.classList.toggle("quick-menu__root--direction-up", direction === "up");
		this.menu.classList.toggle("quick-menu__root--direction-down", direction === "down");
	}

	setOpen(isOpen) {
		this.menu.classList.toggle("quick-menu__root--open", isOpen);
		this.toggle.setAttribute("aria-expanded", String(isOpen));
		this.toggle.setAttribute("aria-label", isOpen ? "퀵메뉴 닫기" : "퀵메뉴 열기");
	}

	snapToCorner() {
		var bounds = this.getBounds();
		var current = this.getPosition();
		var centerX = current.x + bounds.config.size / 2;
		var centerY = current.y + bounds.config.size / 2;
		var target = {
			x: centerX < window.innerWidth / 2 ? bounds.minX : bounds.maxX,
			y: centerY < window.innerHeight / 2 ? bounds.minY : bounds.maxY,
		};

		this.menu.classList.add("quick-menu__root--snap");
		this.setPosition(target);
		this.storePosition(target);

		window.setTimeout(() => {
			this.menu.classList.remove("quick-menu__root--snap");
		}, 240);
	}
}
