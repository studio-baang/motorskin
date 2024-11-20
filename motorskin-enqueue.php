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
    // CSS를 등록할 핸들 (테마나 플러그인 스타일 핸들에 연결 가능)
    $handle = 'custom-dynamic-style';

    // 빈 스타일을 등록해 핸들 생성 (외부 파일 필요 없음)
    wp_register_style($handle, false);

    // 메뉴 데이터 가져오기
    $locations = get_nav_menu_locations();
    if (!isset($locations['gnb'])) return;

    $menu = wp_get_nav_menu_object($locations['gnb']);
    $menu_items = wp_get_nav_menu_items($menu->term_id);
    if (!$menu_items) return;

    // 동적 CSS 생성
    $dynamic_css = '';
    foreach ($menu_items as $menu_item) {
        if (!empty($menu_item->description)) {
            $dynamic_css .= "li.menu-item-{$menu_item->ID}::after { content: '" . esc_js($menu_item->description) . "'; }\n";
        }
    }

    // 동적 CSS를 핸들에 추가
    wp_add_inline_style($handle, $dynamic_css);

    // 스타일 출력
    wp_enqueue_style($handle);
}
add_action('wp_enqueue_scripts', 'add_dynamic_menu_css');
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
