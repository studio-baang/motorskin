<?php 
/*
Plugin Name: Motorskin enqueue
Author: Angba
Description: css, js enqueue
Version: 0.0.0
Requires PHP: 7.4
*/

function wpdocs_theme_name_scripts() {
    wp_enqueue_style( 'motorskin-script-style', plugin_dir_url( __FILE__ ).'/dist/js/app.css' );
	wp_enqueue_style( 'motorskin-custom-style', plugin_dir_url( __FILE__ ).'/dist/css/custom.css' );
	wp_enqueue_script( 'motorskin-script', plugin_dir_url( __FILE__ ). '/dist/js/app.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'wpdocs_theme_name_scripts' );
add_filter('big_image_size_threshold', '__return_false');


// 메뉴에 설명 추가하기
function add_dynamic_menu_css() {
    // 모든 메뉴 위치 가져오기
    $locations = get_nav_menu_locations();
    
    // 'primary'는 테마에 따라 변경 가능
    if (!isset($locations['gnb'])) {
        return;
    }

    // 메뉴 객체와 항목 가져오기
    $menu = wp_get_nav_menu_object($locations['gnb']);
    $menu_items = wp_get_nav_menu_items($menu->term_id);

    if (!$menu_items) {
        return;
    }

    // CSS 출력 시작
    echo '<style>';
    foreach ($menu_items as $menu_item) {
        if (!empty($menu_item->description)) {
            // CSS 추가
            echo "li.menu-item-{$menu_item->ID}::after { content: '" . esc_js($menu_item->description) . "'; }\n";
        }
    }
    echo '</style>';
}
add_action('wp_head', 'add_dynamic_menu_css');

// contact 자동 select data 수집
function pine_dynamic_select_field_values ( $scanned_tag, $replace ) {  
    if ( $scanned_tag['name'] != 'model' )  
        return $scanned_tag;

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
  
    return $scanned_tag;  
}  

add_filter( 'wpcf7_form_tag', 'pine_dynamic_select_field_values', 10, 2); 

// promotion-1 custom link 생성
function add_query_arg_to_link_wrapper() {
    $contact_page_url = site_url( '/contact' );
    $model = '';
    global $post;
    if ( $post ) {
        $model = urlencode( $post->post_title );
    }

    return add_query_arg( 'model', $model, $contact_page_url );
}
