class RemoveDefaultClass {
    constructor() {
        this.init();
    };
    // 기본 div clss 삭제 메소드
    removeDivClass() {
        const div = document.querySelectorAll('div');
        div.forEach(elem => {
            elem.classList.remove('ct-div-block');
        });
    };
    // 기본 section clss 삭제 메소드
    removeSectionClass() {
        const targets = [
            document.querySelectorAll('section'),
            document.querySelectorAll('footer')
        ];

        targets.forEach(target => {
            target.forEach(elem => {
                elem.classList.remove('ct-section');
            })
        });
    };
    init() {
        this.removeDivClass();
        this.removeSectionClass();
    };
}

export default RemoveDefaultClass;