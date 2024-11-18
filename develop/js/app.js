class App {
    constructor() {
        this.body = document.querySelector('body');

        this.pageId = {
            packages: "page-id-15",
        }

        this.init();
    }

    containsId(id) {
        return this.body.classList.contains(id);
    }

    init() {
        if (this.containsId(this.pageId.packages)) {
            console.log('wow');
        }
    }
}

new App();