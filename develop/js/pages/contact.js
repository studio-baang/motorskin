
class Contact {
    constructor() {
        this.textarea = document.querySelector('.wpcf7-textarea');

        this.modal = document.querySelector('.agreement-modal');
        this.openModalBtn = document.querySelector('.contact-form__open-modal');

        this.init();
    }

    init() {
        this.textarea.addEventListener('input', this.handleResizeHeight.bind(this));
        this.openModalBtn.addEventListener('click', this.toggleModal.bind(this));
        this.modal.addEventListener('click', this.toggleModal.bind(this));
    }

    toggleModal() {
        this.modal.classList.toggle('agreement-modal--open');
    }


    handleResizeHeight = () => {
        this.textarea.style.height = 'auto'; //height 초기화
        this.textarea.style.height = this.textarea.scrollHeight + 'px';
    };
}

export default Contact;