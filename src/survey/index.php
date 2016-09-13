<?php
require_once '../survey_lib/config.php';
//defined('TARGET_DIR') OR define('TARGET_DIR', '/target/');
defined('TARGET_DIR') OR define('TARGET_DIR', '/theme_survey/angular/target/');
$requestUri = preg_replace(
		'#^' . preg_quote($_SERVER['BASE'], '#') . '#', '', $_SERVER['REQUEST_URI']
);
//$headers = apache_response_headers();
//var_dump($headers);
//exit;
$key_url = substr($requestUri, 1);
if ($key_url) {
	$db = DB::getInstance();
	$sql = "SELECT * FROM `survey_data_table` WHERE `key_url` = '" . $key_url . "'";
	$q = $db->query($sql);
	if ($q->num_rows > 0) {
		$row = $q->fetch_assoc();
		$row['temp_data'] = json_decode($row['temp_data'], true);
	} else {
		exit('404 - Page Not Found.');
	}
}
?>
<!DOCTYPE html>
<html data-ng-app="app" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" xmlns:og="http://opengraphprotocol.org/schema/"
      xmlns:fb="http://ogp.me/ns/fb#" lang="en">
<head prefix="og: http://ogp.me/ns fb: http://ogp.me/ns/fb">
	<meta charset="utf-8"/>
	<title>Email Survey</title>
	<meta name="description" content="Angularjs, Html5"/>
	<meta name="keywords" content="AngularJS, angular, bootstrap, admin, dashboard, panel, app"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
	<link rel="stylesheet" href="../css/libs.css">
	<link rel="stylesheet" href="../css/app.min.css">
</head>
<body>
<div style="width: 100%; height: 100%;" class="text-center">
	<br/>
	<div class="panel panel-default max-width-600" style="margin: 0 auto;">
		<div class="panel-body text-center">
			<section>
				<br/>
				<div class="text-bold h2">
					<?php echo $row['temp_header']; ?>
				</div>
				<?php if ($row["temp_image"] != '') { ?>
					<div class="margin-top-5">
						<img src="<?php echo $row['temp_image']; ?>" class="img-responsive img-thumbnail" style="cursor: pointer"/>
					</div>
				<?php }
				if ($row["section_id"] == 1 || $row["section_id"] == 2) { ?>
					<br/>
					<div class="h4 margin-top-5">
						<?php echo $row['temp_header1']; ?>
					</div>
					<br/>
				<?php }
				$target_path = "http://" . $_SERVER["SERVER_NAME"] . TARGET_DIR;
				if ($row["section_id"] == 1) {
					$key = 0;
					foreach ($row["temp_data"] as $rr) {
						$href_flag = $row["key_url"] . '_COL_' . $rr["name"] . '_COL_' . $key . '_COL_' . $rr["link"];
						$param = base64_encode($href_flag);
						$href_url = $target_path . $param;
						echo '<div class="margin-top-5 text-center">';
						echo '<a href="' . $href_url . '" class="btn btn-lg btn-info btn-link h4 margin-top-5 link-btn">';
						echo $rr['name'];
						echo '</a>';
						echo '</div>';
						$key++;
					}
					echo '<br/>';
				} else if ($row["section_id"] == 2) {
					echo '<br/><div class="margin-top-5">';
					$key = 0;
					foreach ($row["temp_data"]["rateTemp"] as $rr) {
						$href_flag = $row["key_url"] . '_COL_' . $rr["name"] . '_COL_' . $key . '_COL_' . $rr["link"];
						$param = base64_encode($href_flag);
						$href_url = $target_path . $param;
						echo '<div class="inline">';
						$className = "fa rate-icon " . "fa-" . $row["temp_data"]["rateType"] . "-o";
						echo '<a href="' . $href_url . '" onclick="clickRate(\'' . $key . '\')"><i class="' . $className . ' btn btn-lg"></i></a>';
						echo '</div>';
						$key++;
					}
					echo '</div>';
					echo '<br/><div class="margin-top-5">';
					echo '<div class="pull-left">' . $row["temp_data"]["rateLabel"]["left"] . '</div>';
					echo '<div class="pull-right">' . $row["temp_data"]["rateLabel"]["right"] . '</div>';
					echo '</div>';
					echo '<br/>';
				} else if ($row["section_id"] == 3) {
					echo '<br/><br/><div class="margin-top-5">';
					echo '<div class="col-sm-6 col-xs-6">';
					$href_flag = $row["key_url"] . '_COL_' . $row["temp_data"][0]["name"] . '_COL_0' . '_COL_' . $row["temp_data"][0]["link"];
					$param = base64_encode($href_flag);
					$href_url = $target_path . $param;
					echo '<a href="' . $href_url . '" class="btn btn-lg btn-rounded btn-success pull-right">';
					echo $row["temp_data"][0]["name"];
					echo '</a>';
					echo '</div>';
					echo '<div class="col-sm-6 col-xs-6">';
					$href_flag = $row["key_url"] . '_COL_' . $row["temp_data"][1]["name"] . '_COL_1' . '_COL_' . $row["temp_data"][1]["link"];;
					$param = base64_encode($href_flag);
					$href_url = $target_path . $param;
					echo '<a href="' . $href_url . '" class="btn btn-lg btn-rounded btn-danger pull-left">';
					echo $row["temp_data"][1]["name"];
					echo '</a>';
					echo '</div>';
					echo '<br/><br/><br/>';
					echo '</div>';
				}
				?>
			</section>
		</div>
	</div>
</div>
<script type="text/javascript" src="../survey_lib/jquery.min.js"></script>
<script type="text/javascript">
	var data_temp = <?php echo json_encode($row); ?>;
	function clickRate(index) {
		var class_name = "fa-" + data_temp.temp_data.rateType + "-o";
		var class_name1 = "fa-" + data_temp.temp_data.rateType + "";
		$(".rate-icon").removeClass(class_name).removeClass(class_name1).removeClass("selected-rate");
		for (var i = 0; i < (data_temp.temp_data.rateTemp.length * 1); i++) {
			$(".rate-icon").eq(i).addClass(class_name);
		}
		for (var j = 0; j <= (index * 1); j++) {
			$(".rate-icon").eq(j).removeClass(class_name).addClass(class_name1).addClass("selected-rate");
		}
	}
</script>
</body>
</html>