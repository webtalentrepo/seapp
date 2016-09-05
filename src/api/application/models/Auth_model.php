<?php

/**
 * Created by PhpStorm.
 * User: My
 * Date: 4/11/2016
 * Time: 8:18 PM
 */
class Auth_model extends CI_Model
{
	private $user_table;
	
	public function __construct()
	{
		parent::__construct();
		$this->setUserTable('timer_user');
	}
	
	public function getUserTable()
	{
		return $this->user_table;
	}
	
	public function setUserTable($user_table)
	{
		$this->user_table = $user_table;
	}
	
	public function userLogin($user_email, $user_password)
	{
		$query = $this->db
			->where('u_email', $user_email)
			->where('u_password', $user_password)
			->where('account_status', '0')
			->get($this->getUserTable());
		if ($query->num_rows() && $query->num_rows() > 0) {
			$reData = $query->row_array();
			$target_url = "http://" . $_SERVER["SERVER_NAME"] . '/' . UPLOAD_DIR;
			$target_path = $_SERVER['DOCUMENT_ROOT'] . UPLOAD_DIR;
			$reData['photo'] = $target_url . 'photos/no_photo.jpg';
			$file_path = $target_path . 'photos/a0' . $reData['u_id'] . '.png';
			if (file_exists($file_path)) {
				$reData['photo'] = $target_url . 'photos/a0' . $reData['u_id'] . '.png';
			}
			return $reData;
		} else {
			return array();
		}
	}
	
	public function getUserList($user_email = '')
	{
		if ($user_email != '') {
			$this->db->where('u_email', $user_email);
		}
		$query = $this->db->get($this->getUserTable());
		if ($query->num_rows() && $query->num_rows() > 0) {
			$result = $query->result_array();
			if ($user_email != '') {
				return $result;
			}
			$reArray = array();
			if (sizeof($result) > 0) {
				foreach ($result as $key => $row) {
					$reArray[$key] = array();
					$reArray[$key]['id'] = $row['u_id'];
					$reArray[$key]['first_name'] = $row['u_fname'];
					$reArray[$key]['last_name'] = $row['u_lname'];
					$reArray[$key]['user_email'] = $row['u_email'];
					$reArray[$key]['user_password'] = $row['u_password'];
					$reArray[$key]['user_flag'] = $row['account_type'];
				}
			}
			return $reArray;
		} else {
			return array();
		}
	}
	
	public function RegisterUser($id, $first_name, $last_name, $user_email, $user_password, $user_flag = '')
	{
		if ($first_name == null || $first_name == "") {
			return "Failure";
		}
		if ($last_name == null || $last_name == "") {
			return "Failure";
		}
		if ($user_email == null || $user_email == "") {
			return "Failure";
		}
		if ($user_password == null || $user_password == "") {
			return "Failure";
		}
		$check_data = $this->getUserList($user_email);
		if (sizeof($check_data) > 0) {
			if ($id == "Auto") {
				return "WRONG_EMAIL";
			} else {
				$dup = $check_data[0]['u_id'];
				if ($dup != $id) {
					return "WRONG_EMAIL";
				}
			}
		}
		if ($id == "Auto") {
			$insert_data = array(
				'u_fname' => $first_name,
				'u_lname' => $last_name,
				'u_email' => $user_email,
				'u_password' => $user_password,
				'account_type' => $user_flag,
				'u_active' => 0,
				'u_check' => 1
			);
			$this->db->insert($this->getUserTable(), $insert_data);
		} else {
			$where = array(
				'u_id' => $id
			);
			$update_data = array(
				'u_fname' => $first_name,
				'u_lname' => $last_name,
				'u_email' => $user_email
			);
			if ($check_data[0]['u_password'] != $user_password) {
				$update_data['u_password'] = $user_password;
			}
			if ($user_flag != '') {
				$update_data['account_type'] = $user_flag;
			}
			$this->db->update($this->getUserTable(), $update_data, $where);
		}
		return "success";
	}
	
	public function retrievePwd($user_email, $retrieveKey1)
	{
		$result = $this->getUserList($user_email);
		if (sizeof($result) > 0) {
			$dup = $result[0];
			$data = array(
				'reset_pass' => $retrieveKey1
			);
			$where = array(
				'u_id' => $dup['u_id']
			);
			$this->db->update($this->getUserTable(), $data, $where);
			return "success";
		} else {
			return "Wrong Email";
		}
	}
	
	public function resetPassword($retrieve_key, $user_password)
	{
		$query = $this->db->select("*")
			->where('reset_pass', $retrieve_key)
			->get($this->getUserTable());
		if ($query->num_rows() && $query->num_rows() > 0) {
			$dup = $query->row_array();
			$update_data = array(
				'u_password' => $user_password
			);
			$where = array(
				'u_id' => $dup['u_id']
			);
			$this->db->update($this->getUserTable(), $update_data, $where);
			$dup['u_password'] = $user_password;
			$rData = array(
				"result" => "success",
				"data" => $dup
			);
			return $rData;
		} else {
			return array("result" => "failed");
		}
	}
	
	public function deleteUser($user_id)
	{
		$where = array(
			'u_id' => $user_id
		);
		$this->db->delete($this->getUserTable(), $where);
	}
	
	public function setEsp($user_id, $tbl_flag)
	{
		$update_data = array(
			'tbl_flag' => $tbl_flag
		);
		$where = array(
			'u_id' => $user_id
		);
		$this->db->update($this->getUserTable(), $update_data, $where);
	}
}