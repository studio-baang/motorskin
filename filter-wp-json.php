<?php
add_filter('rest_pre_serve_request', function ($served, $result, $request, $server) {
    header("Access-Control-Allow-Origin: https://motorskin.co.kr");
    header("Access-Control-Allow-Headers: X-Internal-Request, Content-Type");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    // Preflight OPTIONS 요청이라면 응답을 여기서 종료
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit;
    }

    return $served;
}, 10, 4);
function filter_dealer_code_exact_title_match( $args, $request ) {
    // 검색어가 없으면 결과를 반환하지 않음
    if ( empty( $request['search'] ) ) {
        $args['post__in'] = array( 0 ); // 빈 결과 반환
        return $args;
    }

    // 정확한 제목 일치 필터 적용
    $search_term = $request['search'];
    unset( $args['s'] ); // 기본 검색 제거

    static $where_filter_added = false;
    if ( ! $where_filter_added ) {
        add_filter( 'posts_where', function( $where ) use ( $search_term ) {
            global $wpdb;
            $where .= $wpdb->prepare( " AND {$wpdb->posts}.post_title COLLATE utf8mb4_bin = %s", $search_term );
            return $where;
        } );
        $where_filter_added = true;
    }

    return $args;
}
add_filter( 'rest_dealer-code_query', 'filter_dealer_code_exact_title_match', 10, 2 );


add_filter('rest_pre_dispatch', function ($response, $server, $request) {
    $route = $request->get_route();

    // 내부용으로 만든 엔드포인트만 필터링
    if (strpos($route, '/wp/v2/dealer-code') !== false) {

        // internal parameter 확인
        $internal_flag = $request->get_param('aW50ZXJuYWw');

        if ($internal_flag !== "true") {
            return new WP_Error(
                'rest_forbidden',
                '이 API는 내부 서버에서만 접근 가능합니다.'.$internal_flag.$is_internal_ip,
                ['status' => 403]
            );
        }
    }

    return $response;
}, 10, 3);