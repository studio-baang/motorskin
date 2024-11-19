<?php

add_action( 'wp_enqueue_scripts', 'remove_oxygen_stylesheet', 100000000 );

function remove_oxygen_stylesheet() {
    
    wp_dequeue_style('oxygen-universal-styles');
    
    add_filter('style_loader_tag', function ($tag, $handle) {
    if ($handle == 'oxygen-universal-styles' || $handle == 'oxygen-styles') {
        return '';
    }

    return $tag;
    }, 10, 2);


    wp_dequeue_style('oxygen');
    remove_action('wp_head', 'ct_footer_styles_hook');

    add_filter('style_loader_tag', function ($tag, $handle) {
        global $oxygen_vsb_css_files_to_load;

        if (substr($handle, 0, 13) !== 'oxygen-cache-') {
            return $tag;
        }

        $post_id = intval(str_replace('oxygen-cache-', '', $handle));

        if (!in_array($post_id, $oxygen_vsb_css_files_to_load)) {
            return $tag;
        }

        if ($handle == 'oxygen-cache-' . $post_id) {
            return '';
        }

        return $tag;
    }, 10, 2);

}