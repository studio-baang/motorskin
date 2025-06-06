<?php
    // contact 자동 select data 수집
function pine_dynamic_select_field_select ( $scanned_tag, $replace ) {  

    if ($scanned_tag['name'] == 'model' ) {
        // URL에서 'model' 파라미터 값 가져오기
        $current_model = isset($_GET['model']) ? sanitize_text_field($_GET['model']) : '';
        
        $rows = get_posts(
        	array ( 
	            'post_type' => 'car',  
	            'numberposts' => -1,  
	            'orderby' => 'title',
                'order'   => 'ASC', 
            )
        );  
    
        if ( ! $rows )  
            return $scanned_tag;
    
        foreach ( $rows as $row ) { 
            $filter_title = preg_replace('/<span[^>]*>(.*?)<\/span>/', '$1', $row->post_title );
            $scanned_tag['raw_values'][] = $filter_title . '|' . $filter_title;
        }
    
        $pipes = new WPCF7_Pipes($scanned_tag['raw_values']);
    
        $scanned_tag['values'] = $pipes->collect_befores();
        $scanned_tag['labels'] = $pipes->collect_afters();
        $scanned_tag['pipes'] = $pipes;
    
        foreach ( $scanned_tag['values'] as $key => $value ) {
            if ( $value === $current_model ) {
                $scanned_tag['options'][] = 'default:' . $key + 1; // 해당 인덱스를 기본 선택값으로 설정
            }
        }  
    }
    return $scanned_tag;
}  

add_filter( 'wpcf7_form_tag', 'pine_dynamic_select_field_select', 10, 2); 


// remove p tag
add_filter('wpcf7_autop_or_not', '__return_false');

add_filter('wpcf7_mail_components', 'remove_empty_mail_fields', 10, 3);
function remove_empty_mail_fields($components, $contact_form, $mail) {
    foreach ($components as $key => &$component) {
        if (is_array($component)) {
            foreach ($component as $sub_key => $value) {
                if (empty(trim($value))) {
                    unset($component[$sub_key]);
                }
            }
        } else {
            if (empty(trim($component))) {
                unset($components[$key]);
            }
        }
    }
    return $components;
}
