export function createFranchisesMap() {
	const { kakao } = window;
	const points = [
		{
			title: "카바차 본점",
			address: "서울 강서구 화곡로66길 153 아이엠센터 1층",
			latLng: new kakao.maps.LatLng(37.554932, 126.861453),
			marker: null,
		},
		{
			title: "부산 카바차",
			address: "부산시 영도구 태종로 789",
			latLng: new kakao.maps.LatLng(35.065965, 129.081499),
			marker: null,
		},
		{
			title: "대전 카바차",
			address: "대전광역시 동구 가양동 419-2",
			latLng: new kakao.maps.LatLng(36.346529, 127.444595),
			marker: null,
		},
		{
			title: "크레이지 모터스",
			address: "대구광역시 수성구 수성로 157-1",
			latLng: new kakao.maps.LatLng(35.839687, 128.611829),
			marker: null,
		},
		{
			title: "제이알디테일링",
			address: "전라남도 목포시 하당로 56",
			latLng: new kakao.maps.LatLng(34.798618, 126.419774),
			marker: null,
		},
	];
	// 기본 지도 생성
	const container = document.getElementById("map");
	const defaultoptions = {
		center: new kakao.maps.LatLng(33.450701, 126.570667),
		level: 3,
	};

	const map = new kakao.maps.Map(container, defaultoptions);

	// 스크롤로 축소 / 확대 기능 비활성화
	map.setZoomable(false);

	const bounds = new kakao.maps.LatLngBounds();

	for (let i = 0; i < points.length; i++) {
		// 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
		const marker = new kakao.maps.Marker({ position: points[i].latLng });
		marker.setMap(map);
		// point 객체에 생셩한 마커를 저장
		points[i].marker = marker;

		// LatLngBounds 객체에 좌표를 추가합니다
		bounds.extend(points[i].latLng);
	}

	// bound박스 조정
	map.setBounds(bounds);

	// 인포윈도우 선언
	const infowindow = new kakao.maps.InfoWindow({
		map: map,
	});

	// 오버레이 초기화
	infowindow.close();

	// 지도에서 보기 클릭 시 이벤트
	// 1. 지도를 이동하고
	// 2. 거리가 보이게 지도를 확대하고
	// 3. 모든 오버레이를 지운 후 해당 오버레이를 생성한다.
	const confirmButtons = document.querySelectorAll(".franchises-list__button");
	confirmButtons.forEach((confirmButton) => {
		confirmButton.addEventListener("click", (e) => {
			// 선택된 marker의 번호를 가져온다.
			const latlngNum = e.target.dataset.markerNumber || 0;

			// 지도 확대 조정
			map.setLevel(2);

			// 해당 좌표로 지도 이동
			map.panTo(points[latlngNum].latLng);

			infowindow.setContent(`
                <div style="display: flex; flex-direction: column; color: #333333;">
                    <h5>${points[latlngNum].title}</h5>
                    <span>${points[latlngNum].address}</span>
                    <a href="https://map.kakao.com/link/search/${points[latlngNum].address}">크게 보기</a>
                </div>`);
			infowindow.setPosition(points[latlngNum].latLng);

			// 오버레이 재생성
			infowindow.open(map, points[latlngNum].marker);
		});
	});
}
