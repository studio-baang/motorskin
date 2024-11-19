class Contact {
    constructor() {

    }
    onLoad() {
        console.log('전개!');

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
    }
}

export default Contact;