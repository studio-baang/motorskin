<?php 
/*
Plugin Name: Motorskin enqueue
Author: Angba
Description: css, js enqueue
Version: 0.0.0
Requires PHP: 7.4
*/

function wpdocs_theme_name_scripts() {
	wp_enqueue_style( 'motorskin-style', plugin_dir_url( __FILE__ ).'/dist/css/custom.css' );
	wp_enqueue_script( 'motorskin-script', plugin_dir_url( __FILE__ ). '/dist/js/app.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'wpdocs_theme_name_scripts' );
add_filter('big_image_size_threshold', '__return_false');

// Remove default Oxygen.css
 function lit_dequeue_scripts() {
	wp_dequeue_style("oxygen");
}
add_action( 'oxygen_enqueue_scripts', 'lit_dequeue_scripts' );

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

function add_title_to_repeater_link( $attributes ) {
    // 현재 Repeater에서 처리 중인지 확인
    if ( is_admin() || ! isset( $attributes['class'] ) || strpos( $attributes['class'], 'package-slider__card' ) === false ) {
        return $attributes;
    }

    // 현재 포스트의 제목 가져오기
    global $post;
    if ( $post ) {
        $attributes['href'] = add_query_arg( 'model', urlencode( $post->post_title ), site_url( '/contact' ) );
    }

    return $attributes;
}
add_filter( 'oxy_link_wrapper_attributes', 'add_title_to_repeater_link' );