<?php

// dealer code 리스트 접근 차단
add_filter('rest_pre_dispatch', function($result, $server, $request) {
    if ($request->get_route() === '/wp/v2/dealer-code' && $request->get_method() === 'GET') {
        if (!current_user_can('edit_posts')) {
            return new WP_Error('rest_forbidden', '허용되지 않은 접근입니다.', ['status' => 403]);
        }
    }
    return $result;
}, 10, 3);

// dealer code 정확하지 않은 결과 차단
add_filter('rest_post_dispatch', function($result, $server, $request) {
    if ($request->get_route() === '/wp/v2/coupon' && $request->get_param('search')) {
        $search_term = $request->get_param('search');
        $data = $result->get_data();

        $match = false;
        foreach ($data as $item) {
            if (strtolower($item['title']['rendered']) === strtolower($search_term)) {
                $match = true;
                break;
            }
        }

        if (!$match) {
            return new WP_Error('no_match', '일치하는 코드가 없습니다.', ['status' => 404]);
        }
    }

    return $result;
}, 10, 3);
