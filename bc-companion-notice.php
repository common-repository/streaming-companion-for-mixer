<?php
$settings = (array) get_option( 'bc-companion-settings' );
$field = "field_1_1";
$value = esc_attr( $settings[$field] );

if( empty( $value ) ) {
    add_action( 'admin_notices', 'bc_error_notice' );
}

function bc_error_notice() {
    echo '<div class="notice error"><p>Mixer settings not configured! To hook your mixer up to the Broadcast Theme, please add your Mixer username <a href="options-general.php?page=bc-companion">here.</a></div>';
}