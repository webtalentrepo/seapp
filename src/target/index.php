<?php
require_once '../survey_lib/config.php';
//defined('RATE_URL') OR define('RATE_URL', '/rate_score/');
defined('RATE_URL') OR define('RATE_URL', '/theme_survey/angular/rate_score/');
$requestUri = preg_replace(
	'#^' . preg_quote($_SERVER['BASE'], '#') . '#', '', $_SERVER['REQUEST_URI']
);
$param = substr($requestUri, 1);
if ($param) {
	$param = base64_decode($param);
	$paramAry = explode("_COL_", $param);
	date_default_timezone_set('America/New_York');
	$db = DB::getInstance();
	$ins_sql = "INSERT INTO `survey_click_table` (`key_url`, `survey_score`, `temp_index`, `click_ip`, `change_date`) ";
	$ins_sql .= " VALUES ('" . $paramAry[0] . "', '" . $paramAry[1] . "', '" . $paramAry[2] . "', '" . $_SERVER['REMOTE_ADDR'] . "', '" . date("Y-m-d H:i:s") . "')";
	$db->query($ins_sql);
	$id = $db->insert_id;
	$param_str = $paramAry[0] . '_COL_' . $id;
	$param_str = base64_encode($param_str);
	$target_path = "http://" . $_SERVER["SERVER_NAME"] . RATE_URL . $param_str;
	header('location:' . $target_path);
}