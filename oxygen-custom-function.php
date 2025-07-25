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

// dealer 코드의 앞과 뒤를 분리
function splitDealerCode($string) {
    $len = strlen($string);

    if ($len < 2) {
        return [$string, '']; // 문자열이 2자 이하인 경우
    }

    $splitPos = $len - 2;

    $firstPart = substr($string, 0, $splitPos);
    $secondPart = substr($string, $splitPos);
    $secondPart = (int)$secondPart;

    return [$firstPart, $secondPart];
}

// parameter code를 통한 검색 후 boolean 반환
function check_dealer_code_via_rest_api() {
    $result = 'false';

    if ( ! isset($_GET['code']) ) {
        return $result;
    }

    $keyword = sanitize_text_field($_GET['code']);
    list($code, $numbering) = splitDealerCode($keyword);

    $url = get_site_url() . '/wp-json/wp/v2/dealer-code?aW50ZXJuYWw=true&search=' . rawurlencode($code);

    $response = wp_remote_get($url);

    if ( is_wp_error($response) ) {
        return $result;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if ( empty($data) || !is_array($data) ) {
        $result = 'error';
        return $result;
    }

    $max_numbering_range = (int)$data[0]['acf']['range'];
    if ($numbering > 0 && $numbering <= $max_numbering_range) {
        $result = 'true';
    }

    return $result;
}