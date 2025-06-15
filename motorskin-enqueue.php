<?php 
/*
Plugin Name: Motorskin enqueue
Author: Angba
Description: css, js enqueue
Version: 0.0.0
Requires PHP: 7.4
*/

function wpdocs_theme_name_scripts() {
    $customcsspath = plugin_dir_path( __FILE__ ).'dist/css/custom.css';

    wp_enqueue_style( 'motorskin-script-style', plugin_dir_url( __FILE__ ).'dist/js/app.css' );
    wp_enqueue_style( 'motorskin-montserrat', 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap' );
	wp_enqueue_script( 'motorskin-kakao-map', 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=804e935f344c35e8f55be719dabd0fbf', array(), '1.0.0', true );
	wp_enqueue_script( 'motorskin-script', plugin_dir_url( __FILE__ ). 'dist/js/app.js', array(), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'wpdocs_theme_name_scripts', 100 );
add_filter('big_image_size_threshold', '__return_false');

// 1000000 priority so it is executed after all Oxygen's styles
add_action( 'wp_head', 'wpdd_enqueue_css_after_oxygens', 1000000 );
/**
 * Load assets.
 */
function wpdd_enqueue_css_after_oxygens() {
	if ( ! class_exists( 'CT_Component' ) ) {
		return;
	}

	$styles = new WP_Styles;
	$styles->add( 'custom', plugin_dir_url( __FILE__ ).'dist/css/custom.css' );
	$styles->enqueue( array ( 'custom' ) );
	$styles->do_items();
}

// contact 7 custom 관련 func 호출
require_once(plugin_dir_path( __FILE__ ). '/wpcf7.php');

// oxygen function 기능 관련 func 호출
require_once(plugin_dir_path( __FILE__ ). '/oxygen-custom-function.php');

// wp-json 관련 설정
require_once(plugin_dir_path( __FILE__ ). '/filter-wp-json.php');