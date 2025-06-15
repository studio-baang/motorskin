<?php
// car types custom link 생성
function add_query_arg_to_link_wrapper() {
    $contact_page_url = site_url( '/contact' );
    $model = '';
    global $post;
    if ( $post ) {
        $model_remove_span = preg_replace('/<span[^>]*>(.*?)<\/span>/', '$1', $post->post_title );
        $model = urlencode($model_remove_span );
    }

    return add_query_arg( 'model', $model, $contact_page_url );
}

// porsche 패키지 가격
function search_porsche_package_price($post_id, $series_name) {
    $area_number = 'area-1';
    $filter_series_name = strtolower($series_name);

    if(strpos($filter_series_name, "911") !== false || strpos($filter_series_name, "macan") !== false) {
          $area_number = 'area-2';
     }
  
    $area = get_field(  $area_number, $post_id );
    return intval( $area );
}

