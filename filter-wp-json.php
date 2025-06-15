<?php

// dealer code 리스트 접근 차단
add_filter('rest_post_dispatch', function($result, $server, $request) {
    if ($request->get_route() === '/wp/v2/dealer-code' && $request->get_method() === 'GET') {
        if (!$request->get_param('search')) {
            return new WP_Error('rest_forbidden', '전체 쿠폰 리스트 접근은 허용되지 않습니다.', ['status' => 403]);
        }
        // // WP_REST_Response인지 확인 후 처리
        // if ($result instanceof WP_REST_Response) {
        //     $search_term = trim($request->get_param('search'));
        //     $data = $result->get_data();

        //     $match = false;
        //     foreach ($data as $item) {
        //         if (isset($item['title']['rendered'])) {
        //             $item_title = trim($item['title']['rendered']);
        //             if ($item_title === $search_term) {
        //                 $match = true;
        //                 break;
        //             }
        //         }
        //     }

        //     if (!$match) {
        //         return new WP_Error('no_match', '일치하는 쿠폰이 없습니다.', ['status' => 404]);
        //     }
        // }
    }

    return $result;
}, 10, 3);