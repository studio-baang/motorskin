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
add_action( 'oxygen_enqueue_scripts', 'lit_dequeue_scripts' );
function lit_dequeue_scripts() {
	wp_dequeue_style("oxygen");
}

add_filter('wpcf7_form_tag_data_option', function($data, $options, $args) {
	$data = [];
	foreach ($options as $option) {
		…
		if ($option === 'latest_posts') {
			$titles = array_map(function($post) {
				return $post->post_title;
			}, get_posts());
			$data = array_merge($data, $titles);
		}
	}
	return $data;
}, 10, 3);