<?php
function filter_dealer_code_exact_title_match( $args, $request ) {
    if ( isset( $request['search'] ) && ! empty( $request['search'] ) ) {
        $search_term = $request['search'];

        // 's'를 제거하고 'title' 정확 일치로 meta_query 사용
        unset( $args['s'] );

        // SQL 쿼리 커스터마이징을 위해 필터를 추가
        add_filter( 'posts_where', function( $where ) use ( $search_term ) {
            global $wpdb;
            // 제목 정확히 일치하는 경우만
            $where .= $wpdb->prepare( " AND {$wpdb->posts}.post_title = %s", $search_term );
            return $where;
        } );
    }

    return $args;
}
add_filter( 'rest_dealer-code_query', 'filter_dealer_code_exact_title_match', 10, 2 );