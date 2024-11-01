<?php
/**
 * Plugin Name: Streaming Companion For Mixer
 * Description: Modified version of Broadcast Companion. Designed for Mixer.com and its API 
 * Version: 1.2
 * Broadcast Companion Author: StreamWeasels, j.burleigh1
 * Streaming Companion For Mixer Author: chandrahild, JanoriaCorven, 
 * Original Plugin Can Be Found Over At: https://wordpress.org/plugins/broadcast-companion/
 */ 

add_action( 'admin_menu', 'bc_companion_menu' );
function bc_companion_menu() {
    add_options_page( 'Streaming Companion For Mixer', 'Streaming Companion For Mixer', 'manage_options', 'bc-companion', 'bc_companion_options' );
}
add_action( 'admin_init', 'bc_companion_admin_init' );

function bc_companion_js() {

	$settings = (array) get_option( 'bc-companion-settings' );
	$field = "field_1_1";
	$value = esc_attr( $settings[$field] );
    $swLogo = plugins_url( 'SW-main-logo.svg', __FILE__);
    
    wp_enqueue_script('bc-companion-main', plugins_url( 'bc-companion-main.js', __FILE__ ), array('jquery'), '', false );
    wp_add_inline_script( 'bc-companion-main', 'jQuery(document).ready(function(){MixerUsername =  "'.$value.'";swLogo = "'.$swLogo.'"});', 'before');
}
add_action( 'wp_enqueue_scripts', 'bc_companion_js' );

function bc_companion_admin_init() {
  
  /* 
	 * http://codex.wordpress.org/Function_Reference/register_setting
	 * register_setting( $option_group, $option_name, $sanitize_callback );
	 * The second argument ($option_name) is the option name. It’s the one we use with functions like get_option() and update_option()
	 * */
  	# With input validation:
  	# register_setting( 'my-settings-group', 'my-plugin-settings', 'my_settings_validate_and_sanitize' );    
  	register_setting( 'bc-companion-settings-group', 'bc-companion-settings', 'bc_companion_validate_and_sanitize' );
	
  	/* 
	 * http://codex.wordpress.org/Function_Reference/add_settings_section
	 * add_settings_section( $id, $title, $callback, $page ); 
	 * */	 
  	add_settings_section( 'section-1', __( 'Mixer Settings', 'bc-companion' ), 'bc_companion_section_1_callback', 'bc-companion' );
	
	/* 
	 * http://codex.wordpress.org/Function_Reference/add_settings_field
	 * add_settings_field( $id, $title, $callback, $page, $section, $args );
	 * */
  	add_settings_field( 'field-1-1', __( 'Mixer Username', 'bc-companion' ), 'bc_companion_field_1_1_callback', 'bc-companion', 'section-1' );
	
}

function bc_companion_options() { ?>
    <div class="wrap">
    <h2><?php _e('Broadcast Options', 'bc-companion'); ?></h2>
    <?php _e('This is where you can configure Broadcast to hook into your mixer.com channel', 'bc-companion'); ?>
    <form action="options.php" method="POST">
    <?php  settings_fields('bc-companion-settings-group');
           do_settings_sections('bc-companion'); ?>
        <input name="Submit" type="submit" value="Save Changes" />
    </form>
    </div>
<?php }

// Section
function bc_companion_section_1_callback() {
	_e( 'Mixer Settings go here!', 'bc-companion' );
}

// Fields
function bc_companion_field_1_1_callback() {
	
	$settings = (array) get_option( 'bc-companion-settings' );
	$field = "field_1_1";
	$value = esc_attr( $settings[$field] );

	echo "<input type='text' name='bc-companion-settings[$field]' value='$value' />";
}

// Validation
function bc_companion_validate_and_sanitize( $input ) {
	$settings = (array) get_option( 'bc-companion-settings' );
	
	if ( isset( $input['field_1_1'] ) ) {
		$output['field_1_1'] = sanitize_text_field( $input['field_1_1'] );
	} else {
		add_settings_error( 'bc-companion-settings', 'invalid-field_1_1', 'You have entered an invalid value into Field One.' );
	}
	
	// and so on for each field
	
	return $output;
}

require_once(plugin_dir_path( __FILE__ ) . '/bc-companion-notice.php');