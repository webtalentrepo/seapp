<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Created by PhpStorm.
 * User: My
 * Date: 4/5/2016
 * Time: 3:05 PM
 */
class Survey extends App_Controller
{
	
	public function __construct()
	{
		parent::__construct();
		$this->load->model('Survey_model', 's_m');
	}
	
	public function index()
	{
	}
	
	public function uploadimage()
	{
		$config['upload_path'] = './uploads/survey';
		$config['allowed_types'] = 'jpg|jpeg|png|bmp|gif';
		$config['max_size'] = 512000;
		$file_name = mt_rand() . '_' . time(); //30 digit Generate
		$config['file_name'] = $file_name;
		$this->load->library('upload', $config);
		if (!$this->upload->do_upload('file')) {
			$error = $this->upload->display_errors();
			exit($error);
		} else {
			$data = $this->upload->data();
			$data['result'] = 'success';
		}
		exit($this->sendJsonResponse($data));
	}
	
	public function removeimage()
	{
		$file_name = $this->getRequestPayloadParameter('file_name');
		$target_file = $_SERVER['DOCUMENT_ROOT'] . UPLOAD_DIR . 'survey/' . $file_name;
		if (file_exists($target_file)) {
			unlink($target_file);
		}
	}
	
	public function getdata()
	{
		$user_id = $this->getRequestPayloadParameter('user_id');
		$result = $this->s_m->getData($user_id);
		exit($this->sendJsonResponse($result));
	}
	
	public function getdatabyid()
	{
		$id = $this->getRequestPayloadParameter('id');
		$result = $this->s_m->getDataById($id);
		exit($this->sendJsonResponse($result));
	}
	
	public function deletetemp()
	{
		$id = $this->getRequestPayloadParameter('id');
		$temp_file = $this->getRequestPayloadParameter('temp_file');
		$target_file = $_SERVER['DOCUMENT_ROOT'] . UPLOAD_DIR . 'survey/' . $temp_file;
		if ($temp_file != '' && file_exists($target_file)) {
			unlink($target_file);
		}
		$this->s_m->deleteTemp($id);
		$result = array('result' => 'success');
		exit($this->sendJsonResponse($result));
	}
	
	public function savedata()
	{
		$data = $this->getRequestPayloadParameters();
		$result = $this->s_m->saveData($data);
		exit($this->sendJsonResponse($result));
	}
	
	public function clonedata()
	{
		$id = $this->getRequestPayloadParameter('id');
		$user_id = $this->getRequestPayloadParameter('user_id');
		$result = $this->s_m->CloneData($id, $user_id);
		exit($this->sendJsonResponse($result));
	}
	
}