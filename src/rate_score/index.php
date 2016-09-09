<?php
require_once '../survey_lib/config.php';
$requestUri = preg_replace(
		'#^' . preg_quote($_SERVER['BASE'], '#') . '#', '', $_SERVER['REQUEST_URI']
);
$param = substr($requestUri, 1);
if ($param) {
	$param = base64_decode($param);
	$paramAry = explode("_COL_", $param);
	$key_url = $paramAry[0];
	$score_id = $paramAry[1];
	date_default_timezone_set('America/New_York');
	$db = DB::getInstance();
	$sql = "SELECT L.survey_score, L.survey_data, L.temp_index, L.tbl_flag AS saveFlag, R.* FROM `survey_click_table` AS L ";
	$sql .= "LEFT OUTER JOIN `survey_data_table` AS R ON L.key_url=R.key_url WHERE L.id='" . $score_id . "' AND L.key_url='" . $key_url . "'";
	$q = $db->query($sql);
	if ($q->num_rows > 0) {
		$row = $q->fetch_assoc();
		$row['temp_data'] = json_decode($row['temp_data'], true);
		$title_array = array('feedback', 'score', 'answer');
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
			<br/>
			<div class="text-bold h2">
				<?php echo $row['temp_header']; ?>
			</div>
			<?php if ($row["temp_image"] != '') { ?>
				<div class="margin-top-5">
					<img src="<?php echo $row['temp_image']; ?>" class="img-responsive img-thumbnail" style="cursor: pointer"/>
				</div>
			<?php } ?>
			<section id="feedback" style="display: none;">
				<?php
				if ($row["section_id"] == 1 || $row["section_id"] == 2) { ?>
					<br/>
					<div class="h4 margin-top-5">
						<?php echo $row['temp_header1']; ?>
					</div>
					<br/>
				<?php }
				if ($row["section_id"] == 1) {
					$key = 0;
					foreach ($row["temp_data"] as $rr) {
						$cls = (($row["temp_index"] * 1) == $key) ? " shadow-btn" : "";
						echo '<div class="margin-top-5 text-center">';
						echo '<a class="btn btn-lg btn-info btn-link h4 margin-top-5 link-btn' . $cls . '" onclick="clickLink(\'' . $key . '\', this)">';
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
						echo '<div class="inline">';
						$className = "fa rate-icon " . "fa-" . $row["temp_data"]["rateType"] . "-o";
						echo '<a onclick="clickRate(\'' . $key . '\')"><i class="' . $className . ' btn btn-lg"></i></a>';
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
					$key = 0;
					$cls = (($row["temp_index"] * 1) == $key) ? " shadow-btn" : "";
					echo '<a class="btn btn-lg btn-rounded btn-success pull-right answer-btn' . $cls . '" onclick="clickLink(\'' . $key . '\', this)">';
					echo $row["temp_data"][0]["name"];
					echo '</a>';
					$key++;
					echo '</div>';
					$cls = (($row["temp_index"] * 1) == $key) ? " shadow-btn" : "";
					echo '<div class="col-sm-6 col-xs-6">';
					echo '<a class="btn btn-lg btn-rounded btn-danger pull-left answer-btn' . $cls . '" onclick="clickLink(\'' . $key . '\', this)">';
					echo $row["temp_data"][1]["name"];
					echo '</a>';
					echo '</div>';
					echo '<br/><br/><br/>';
					echo '</div>';
				}
				?>
			</section>
			<section id="score_rate">
				<br/>
				<p class="text-bold h3">
					You gave us a <?php echo $title_array[($row["section_id"] * 1 - 1)]; ?> of:
				</p>
				<div class="margin-top-5" id="score_div" onclick="changeClick()" style="cursor: pointer;">
					<br/>
					<span class="h2" id="score_value" style="border-bottom: 1px dotted;">"<?php echo $row["survey_score"]; ?>"</span>
					<br/>
					<span class="small" id="change_label">(change <?php echo $title_array[($row["section_id"] * 1 - 1)]; ?>)</span>
				</div>
			</section>
			<section>
				<div class="margin-top-5">
					<hr/>
				</div>
				<!--				<p class="margin-top-5 h4">-->
				<!--					What is the most important reason for your -->
				<?php //echo $title_array[($row["section_id"] * 1 - 1)]; ?><!--?-->
				<!--				</p>-->
				<!--				<div class="margin-top-5">-->
				<!--					<textarea id="surveyData" class="form-control" cols="40" rows="6"></textarea>-->
				<!--				</div>-->
				<div class="margin-top-5">
					<button class="btn btn-large btn-success" id="submitBtn" style="min-width: 150px;" onclick="submitSurvey()">SUBMIT</button>
					<span class="text-bold h4" id="audit_span" style="display: none;">
						Thanks for your <?php echo $title_array[($row["section_id"] * 1 - 1)]; ?>
					</span>
				</div>
			</section>
		</div>
	</div>
</div>
<script type="text/javascript" src="../survey_lib/jquery.min.js"></script>
<script type="text/javascript">
	var data_temp = <?php echo json_encode($row); ?>;
	function changeClick() {
		$("#score_rate").hide();
		$("#feedback").fadeIn();
	}
	function clickLink(index, obj) {
		if (data_temp.section_id == 1) {
			$(".link-btn").removeClass("shadow-btn");
		} else if (data_temp.section_id == 3) {
			$(".answer-btn").removeClass("shadow-btn");
		}
		$(obj).addClass("shadow-btn");
		data_temp.survey_score = $(obj).html();
		data_temp.temp_index = index;
		$("#score_value").html('"' + data_temp.survey_score + '"');
	}
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
		data_temp.survey_score = data_temp.temp_data.rateTemp[index].value;
		data_temp.temp_index = index;
		$("#score_value").html('"' + data_temp.survey_score + '"');
	}
	
	function submitSurvey() {
//		data_temp.survey_data = $("#surveyData").val();
		$.ajax({
			url: 'save.php',
			data: "survey_score=" + data_temp.survey_score + "&temp_index=" + data_temp.temp_index + "&key_url=" + data_temp.key_url,
			type: "post",
			success: function (re) {
				if (re == "success") {
					$("#submitBtn").hide();
					$("#audit_span").fadeIn();
					$("#feedback").hide();
					$("#score_rate").fadeIn();
					$("#change_label").hide();
					$("#score_div").attr("onclick", false);
				}
			}
		});
	}
	
	$(function () {
		if (data_temp.saveFlag == 1) {
			$("#submitBtn").hide();
			$("#audit_span").fadeIn();
			$("#feedback").hide();
			$("#score_rate").fadeIn();
			$("#change_label").hide();
			$("#score_div").attr("onclick", false);
		}
		if (data_temp.section_id == 2) {
			var class_name = "fa-" + data_temp.temp_data.rateType + "-o";
			var class_name1 = "fa-" + data_temp.temp_data.rateType + "";
			$(".rate-icon").removeClass(class_name).removeClass(class_name1).removeClass("selected-rate");
			for (var i = 0; i < (data_temp.temp_data.rateTemp.length * 1); i++) {
				$(".rate-icon").eq(i).addClass(class_name);
			}
			for (var j = 0; j <= (data_temp.temp_index * 1); j++) {
				$(".rate-icon").eq(j).removeClass(class_name).addClass(class_name1).addClass("selected-rate");
			}
		}
	});
</script>
</body>
</html>