<?php

/**
 * Created by PhpStorm.
 * User: My
 * Date: 4/6/2016
 * Time: 5:42 PM
 */
class Survey_model extends CI_Model
{
	
	private $survey_data_table;
	private $survey_click_table;
	
	public function __construct()
	{
		parent::__construct();
		$this->survey_data_table = 'survey_data_table';
		$this->survey_click_table = 'survey_click_table';
	}
	
	public function saveData($data)
	{
		$data['temp_data'] = json_encode($data['temp_data']);
		if ($data['id'] == 'NEW') {
			$file_key = mt_rand() . '_' . time();
			$file_key .= $this->_RandomString();
			$file_key = base64_encode($file_key);
			$data['key_url'] = $file_key;
			$data['change_date'] = date("Y-m-d H:i:s");
			$this->db->insert($this->survey_data_table, $data);
		} else {
			$data['change_date'] = date("Y-m-d H:i:s");
			if ($data['key_url'] == '') {
				$file_key = mt_rand() . '_' . time();
				$file_key .= $this->_RandomString();
				$file_key = base64_encode($file_key);
				$data['key_url'] = $file_key;
			}
			$this->db->where('id', $data['id']);
			$this->db->update($this->survey_data_table, $data);
		}
		return array(
			'result' => 'success'
		);
	}
	
	public function getData($user_id)
	{
		$this->db->where('user_id', $user_id);
		$this->db->order_by('change_date DESC, section_id');
		$query = $this->db->get($this->survey_data_table);
		if ($query->num_rows() && $query->num_rows() > 0) {
			$rows = $query->result_array();
			$data = array();
			foreach ($rows as $key => $row) {
				$data[$key] = $row;
				$data[$key]['temp_data'] = json_decode($row['temp_data']);
			}
			return array(
				'result' => 'success',
				'data' => $data
			);
		} else {
			return array(
				'result' => 'failure'
			);
		}
	}
	
	public function getDataById($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->survey_data_table);
		if ($query->num_rows() && $query->num_rows() > 0) {
			$data = $query->row_array();
			$data['temp_data'] = json_decode($data['temp_data']);
			return array(
				'result' => 'success',
				'data' => $data
			);
		} else {
			return array(
				'result' => 'failure'
			);
		}
	}
	
	public function CloneData($id, $user_id)
	{
		$result = $this->getDataById($id);
		if ($result['result'] == 'success') {
			$data = $result['data'];
			$data['id'] = 'NEW';
			$data['user_id'] = $user_id;
			$data['temp_data'] = json_encode($data['temp_data']);
			$data['temp_name'] = $data['temp_name'] . ' - Cloned';
			$file_key = mt_rand() . '_' . time();
			$file_key .= $this->_RandomString();
			$file_key = base64_encode($file_key);
			$data['key_url'] = $file_key;
			$data['change_date'] = date("Y-m-d H:i:s");
			if ($data['temp_file'] != '') {
				$file_name = mt_rand() . '_' . time();
				$target_path = $_SERVER['DOCUMENT_ROOT'] . UPLOAD_DIR . 'survey/';
				$origin_file = $target_path . $data['temp_file'];
				$to_file = $target_path . $file_name . '.png';
				copy($origin_file, $to_file);
				$data['temp_image'] = 'http://' . $_SERVER['SERVER_NAME'] . UPLOAD_DIR . 'survey/' . $file_name . '.png';
				$data['temp_file'] = $file_name . '.png';
			}
			$this->db->insert($this->survey_data_table, $data);
			return array('result' => 'success');
		} else {
			return array('result' => 'failure');
		}
	}
	
	public function deleteTemp($id)
	{
		$this->db->where('id', $id);
		$this->db->delete($this->survey_data_table);
	}
	
	/**
	 * Create random string...
	 * @return string
	 */
	private function _RandomString()
	{
		return bin2hex(openssl_random_pseudo_bytes(8));
	}
	
	public function getReport($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->survey_data_table);
		$data = array();
		$totalClicks = 0;
		if ($query->num_rows() && $query->num_rows() > 0) {
			$row = $query->row_array();
			$temp_data = json_decode($row['temp_data'], true);
			if ($row['section_id'] == 2) {
				$rateType = $temp_data['rateType'];
				$temp_data = $temp_data['rateTemp'];
			}
			$key = 0;
			foreach ($temp_data as $rr) {
				$data[$key] = array();
				$data[$key]['name'] = ($row['section_id'] == 2) ? ($rateType . ' ' . $rr['name']) : $rr['name'];
				$data[$key]['link'] = $rr['link'];
				$qry = $this->db
					->where('key_url', $row['key_url'])
					->where('survey_score', $rr['name'])
					->get($this->survey_click_table);
				if ($qry->num_rows() && $qry->num_rows() > 0) {
					$data[$key]['y'] = $qry->num_rows() * 1;
				} else {
					$data[$key]['y'] = 0;
				}
				$totalClicks += $data[$key]['y'] * 1;
				$key ++;
			}
		}
		return array(
			'result' => 'success',
			'data' => $data,
			'totalClicks' => $totalClicks
		);
	}
}