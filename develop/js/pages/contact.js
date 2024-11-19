class Contact {
    constructor() {

    }
    onLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const promo = urlParams.get('promo'); // 'promo' 파라미터 값 가져오기

        if (promo) {
            // 파라미터 값의 공백 처리 (디코딩)
            const decodedPromo = decodeURIComponent(promo.trim());

            // <select> 요소 선택
            const selectElement = document.querySelector('select[name="model"]');

            // <select>에서 해당 값을 가진 옵션 선택
            for (const option of selectElement.options) {
                if (option.value === decodedPromo) { // 공백이 정상적으로 처리된 값과 비교
                    option.selected = true; // 해당 옵션 선택
                    break;
                }
            }
        }
    }
}

export default Contact;