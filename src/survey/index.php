<?php
require_once 'config.php';
//defined('TARGET_DIR') OR define('TARGET_DIR', '/target/');
defined('TARGET_DIR') OR define('TARGET_DIR', '/theme_survey/angular/target/');
$requestUri = preg_replace(
		'#^' . preg_quote($_SERVER['BASE'], '#') . '#', '', $_SERVER['REQUEST_URI']
);
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
<div class="panel panel-default max-width-600">
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
			$href_url = "http://" . $_SERVER["SERVER_NAME"] . TARGET_DIR . $row['key_url'];
			if ($row["section_id"] == 1) {
				foreach ($row["temp_data"] as $rr) {
					echo '<div class="margin-top-5 text-center">';
					echo '<a class="btn btn-lg btn-info btn-link h4 margin-top-5 link-btn">';
					echo $rr['name'];
					echo '</a>';
					echo '</div>';
				}
				echo '<br/>';
			} else if ($row["section_id"] == 2) {
				echo '<br/><div class="margin-top-5">';
				foreach ($row["temp_data"]["rateTemp"] as $rr) {
					echo '<div class="inline">';
					$className = "fa rate-icon " . "fa-" . $row["temp_data"]["rateType"] . "-o";
					echo '<a><i class="' . $className . ' btn btn-lg"></i></a>';
					echo '</div>';
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
				echo '<a class="btn btn-lg btn-rounded btn-success pull-right">';
				echo $row["temp_data"][0]["name"];
				echo '</a>';
				echo '</div>';
				echo '<div class="col-sm-6 col-xs-6">';
				echo '<a class="btn btn-lg btn-rounded btn-danger pull-left">';
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
</body>
</html>