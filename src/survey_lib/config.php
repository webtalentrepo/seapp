<?php

class DB
{
	const DB_HOST = "localhost";
	const DB_NAME = "svemail_db";
	const DB_USER = "root";
	const DB_PASSWORD = "";
	
	/**
	 * @return DB
	 */
	public static function getInstance()
	{
		static $instance;
		
		if (null === $instance) {
			$instance = mysqli_connect(self::DB_HOST, self::DB_USER, self::DB_PASSWORD, self::DB_NAME);
		}
		
		return $instance;
	}
}
