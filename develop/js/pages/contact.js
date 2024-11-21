
class Contact {
    constructor() {
    }
    onLoad() {
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const model = urlParams.get('model'); // 'promo' 파라미터 값 가져오기

            if (model) {
                // 파라미터 값의 공백 처리 (디코딩)
                const decodeModel = decodeURIComponent(model.trim());

                // <select> 요소 선택
                const selectElement = document.querySelector('select[name="model"]');

                // <select>에서 해당 값을 가진 옵션 선택
                for (const option of selectElement.options) {
                    if (option.value === decodeModel) { // 공백이 정상적으로 처리된 값과 비교
                        option.selected = true; // 해당 옵션 선택
                        break;
                    }
                }
            }
        }, 100);
    }

    autoHeightTextarea() {
        const textarea = document.querySelector('.wpcf7-textarea');
        textarea.addEventListener('input', this.handleResizeHeight.bind(this));
    }

    handleResizeHeight = (event) => {
        event.style.height = 'auto'; //height 초기화
        event.style.height = event.scrollHeight + 'px';
    };
}

export default Contact;