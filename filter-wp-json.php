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