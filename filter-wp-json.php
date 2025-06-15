<?php

// dealer code 리스트 접근 차단
add_filter('rest_post_dispatch', function($result, $server, $request) {
    $route = $request->get_route();

    // dealer-code GET 요청에 대해서만 필터 적용
    if (strpos($route, '/wp/v2/dealer-code') === 0 && $request->get_method() === 'GET') {
        
        // search 파라미터가 없는 경우 전체 목록 차단
        $search_term = trim($request->get_param('search'));
        if (!$search_term) {
            return new WP_Error('rest_forbidden', '전체 쿠폰 리스트 접근은 허용되지 않습니다.', ['status' => 403]);
        }

        // 에러 응답인 경우 그대로 반환
        if (is_wp_error($result)) {
            return $result;
        }

        // WP_REST_Response인 경우 결과에서 정확히 일치하는 항목이 있는지 확인
        if ($result instanceof WP_REST_Response) {
            $data = $result->get_data();
            $match = false;

            foreach ($data as $item) {
                if (isset($item['title']['rendered'])) {
                    $item_title = trim($item['title']['rendered']);
                    if ($item_title === $search_term) { // 대소문자 정확 일치
                        $match = true;
                        break;
                    }
                }
            }

            if (!$match) {
                return new WP_Error('no_match', '일치하는 쿠폰이 없습니다.', ['status' => 404]);
            }
        }
    }

    return $result;
}, 10, 3);
