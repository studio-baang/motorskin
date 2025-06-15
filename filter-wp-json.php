<?php

// dealer code 리스트 접근 차단
add_filter('rest_pre_dispatch', function($result, $server, $request) {
    // 대상: 쿠폰 CPT의 GET 요청
    if ($request->get_route() === '/wp/v2/dealer-code' && $request->get_method() === 'GET') {
        // search 파라미터가 없는 경우: 전체 리스트 요청 → 차단
        if (!$request->get_param('search')) {
            return new WP_Error('rest_forbidden', '허용되지 않은 접근입니다.', ['status' => 403]);
        }

        // 에러 응답이 아니고, 정상적으로 결과가 왔는지 확인
        if (!is_wp_error($result)) {
            $search_term = trim(mb_strtolower($request->get_param('search'), 'UTF-8'));
            $data = $result->get_data();

            $match = false;
            foreach ($data as $item) {
                $item_title = trim($item['title']['rendered']);
                if ($item_title === $search_term) {
                    $match = true;
                    break;
                }
            }

            if (!$match) {
                return new WP_Error('no_match', '일치하는 쿠폰이 없습니다.', ['status' => 404]);
            }
        }
    }

    return $result;
}, 10, 3);