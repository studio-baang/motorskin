function renderReceipt() {
	const element = `<div class="contact-receipt">
		<div class="contact-receipt__head">
			<span class="contact-receipt__index">시공 미리보기</span>
			<h3 id="contact-receipt-title" class="contact-receipt__title">모델명</h3>
			<p id="contact-receipt-promotion"></p>
		</div>
		<div class="contact-receipt__container">
			<span class="contact-receipt__index">기본 사항</span>
			<ul class="contact-receipt__options" id="contact-receipt__options">
			</ul>
		</div>
		<div class="contact-receipt__quotation">
			<span class="contact-receipt__index">예상 견적</span>
			<span class="contact-receipt__payment"><strong id="contact-receipt-amount">0</strong>원 ~</span>
		</div>
	</div>`;
}
