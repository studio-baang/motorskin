<?php
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

add_filter( 'rest_pre_dispatch', function ( $result, $server, $request ) {
    $route = $request->get_route();
    $method = $request->get_method();

    // 단일 포스트 접근인지 확인 (GET /wp/v2/dealer-code/{id})
    if ( $method === 'GET' && preg_match( '#^/wp/v2/dealer-code/(\d+)$#', $route, $matches ) ) {
        return new WP_Error(
            'rest_forbidden',
            __( '개별 포스트 접근은 허용되지 않습니다.', 'your-text-domain' ),
            array( 'status' => 403 )
        );
    }

    return $result;
}, 10, 3 );


add_filter('rest_pre_dispatch', function ($response, $server, $request) {
     $route = $request->get_route();
    $method = $request->get_method();

    // 내부용으로 만든 엔드포인트만 필터링
    if (strpos($route, '/wp/v2/dealer-code') !== false) {
        $remote_ip = $_SERVER['REMOTE_ADDR'];
        $headers = getallheaders();
        $internal_flag = isset($headers['X-Internal-Request']) ? $headers['X-Internal-Request'] : '';

        // 조건 1: 내부 IP 또는 로컬호스트
        $is_internal_ip = in_array($remote_ip, ['127.0.0.1', '::1', '192.168.0.0/16']);

        // 조건 2: 커스텀 헤더를 통한 확인
        $is_valid_request = ($internal_flag === 'true');

                // 로그 찍기 (워드프레스 디버그 로그 사용)
        error_log("Incoming IP: " . $remote_ip);
        error_log("Incoming Headers: " . print_r($headers, true));

        if (!$is_internal_ip && !$is_valid_request) {
            return new WP_Error(
                'rest_forbidden',
                '이 API는 내부 서버에서만 접근 가능합니다.'.$internal_flag.$is_internal_ip,
                ['status' => 403]
            );
        }
    }

    return $response;
}, 10, 3);