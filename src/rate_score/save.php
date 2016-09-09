<?php
require_once '../survey_lib/config.php';
date_default_timezone_set('America/New_York');
$db = DB::getInstance();

$data = $_REQUEST;

$sql = "UPDATE `survey_click_table` SET `tbl_flag` = '1', `survey_score` = '" . $data["survey_score"] . "'";
$sql .= ", `temp_index` = '" . $data["temp_index"] . "', `change_date` = '" . date("Y-m-d H:i:s") . "' WHERE `key_url` = '" . $data["key_url"] . "'";
$db->query($sql);
exit("success");