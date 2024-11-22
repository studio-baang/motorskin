<?php
    // contact 자동 select data 수집
function pine_dynamic_select_field_values ( $scanned_tag, $replace ) {  
    if ( $scanned_tag['name'] != 'model' )  
        return $scanned_tag;

        // URL에서 'model' 파라미터 값 가져오기
    $current_model = isset($_GET['model']) ? sanitize_text_field($_GET['model']) : '';

    $rows = get_posts(
    	array ( 
	        'post_type' => 'promotion-1',  
	        'numberposts' => -1,  
	        'orderby' => 'date',
            'order'   => 'DESC', 
        )
    );  
  
    if ( ! $rows )  
        return $scanned_tag;

    foreach ( $rows as $row ) {  
        $scanned_tag['raw_values'][] = $row->post_title . '|' . $row->post_title;
    }

    $pipes = new WPCF7_Pipes($scanned_tag['raw_values']);

    $scanned_tag['values'] = $pipes->collect_befores();
    $scanned_tag['labels'] = $pipes->collect_afters();
    $scanned_tag['pipes'] = $pipes;

    // 파라미터와 옵션값이 동일하면 'selected' 옵션 추가
    foreach ( $scanned_tag['values'] as $key => $value ) {
        if ( $value === $current_model ) {
            $scanned_tag['options'][] = 'default:' . $key; // 해당 옵션 선택
        }
    }
  
    return $scanned_tag;  
}  

add_filter( 'wpcf7_form_tag', 'pine_dynamic_select_field_values', 10, 2); 

// remove p tag
add_filter('wpcf7_autop_or_not', '__return_false');