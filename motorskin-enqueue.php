<?php 
/*
Plugin Name: Motorskin enqueue
Author: Angba
Description: css, js enqueue
Version: 0.0.0
Requires PHP: 7.4
*/

function wpdocs_theme_name_scripts() {
    wp_enqueue_style( 'motorskin-style', plugin_dir_url( __FILE__ ).'/dist/js/app.css' );
	wp_enqueue_style( 'motorskin-style', plugin_dir_url( __FILE__ ).'/dist/css/custom.css' );
	wp_enqueue_script( 'motorskin-script', plugin_dir_url( __FILE__ ). '/dist/js/app.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'wpdocs_theme_name_scripts' );

add_filter('big_image_size_threshold', '__return_false');

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