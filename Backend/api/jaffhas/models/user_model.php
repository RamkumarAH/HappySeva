<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );
class User_model extends CI_Model {

	/**
	 *
	 * @author Manju.
	 *         @purpose Construct of user_model class.
	 */
	public function __construct() {
		parent::__construct ();
		$this->load->database ();
		$this->load->model ( 'riderpassenger_model', 'Riderpassenger' );
	}

	/**
	 *
	 * @author Manju.
	 *         @purpose checking login form sbmit details in DB.
	 */
	function login($email, $password) {
		$this->db->where ( "email", $email );
		$this->db->where ( "password", $password );

		$query = $this->db->get ( "users" );
		//echo $this->db->last_query();exit;
		if ($query->num_rows () > 0) {
			foreach ( $query->result () as $rows ) {
				// add all data to session
				$newdata = array (
						'user_id' => $rows->user_id,
						'user_name' => $rows->name,
						'email' => $rows->email,
						'access_token' => $rows->access_token,
						'logged_in' => TRUE
				);
			}
			$this->session->set_userdata ( $newdata );
			return true;
		}
		return false;
	}

	/**
	 *
	 * @author Manju.
	 *         @check for email availability during registeration.
	 */
	public function check_duplicate_email($email) {
		$this->db->where ( 'email', $email );

		$query = $this->db->get ( 'users' );

		$count_row = $query->num_rows ();

		if ($count_row > 0) {
			// if count row return any row; that means you have already this email address in the database. so you must set false in this sense.
			return TRUE; // here I change TRUE to false.
		} else {
			// doesn't return any row means database doesn't have this email
			return FALSE; // And here false to TRUE
		}
	}

	/**
	 *
	 * @author Manju.
	 *         @purpose add new user in to the DB.
	 */
	public function add_user($name, $email, $password, $phonenumber) {

		// check for duplicate email-id
		if ($this->check_duplicate_email ( $email )) {

			return FALSE; // return false if email-id already exists.
		}

		$data = array (
				'name' => $name,
				'email' => $email,
				'password' => md5 ( $password),
				'phone_number' => $phonenumber,
				'created_date_time' => date ( "Y-m-d H:i:s" ),
				'ip_address' => $_SERVER ['REMOTE_ADDR']
		);

		$this->db->insert ( 'users', $data );
		$id = $this->db->insert_id ();
		$access_token = $this->common_methods->random_id ( $id );

		$data = array (
				'access_token' => $access_token
		)
		;

		$this->db->where ( 'user_id', $id );
		$this->db->update ( 'users', $data );

		return TRUE; // return true for successfull registeration.
	}

	/**
	 *
	 * @author Manju.
	 *         @purpose function to Get user details from DB.
	 */
	public function get_user_details($access_token) {
		$user_id = $this->Riderpassenger->get_userid ( $access_token );

		if ($user_id == 0) {

			return; // return 5: wrong access token, invalid request'
		}

		$this->db->where ( "user_id", $user_id );
		$query = $this->db->get ( "users" );
		return $query->row_array ();
	}

	/**
	 * @author Manju.
	 * @purpose to update user in DB.
	 */
	public function user_update($access_token, $fullname, $dob, $profile_photo, $gender, $password, $phonenumber) {

		$user_id = $this->Riderpassenger->get_userid ( $access_token );

		if ($user_id == 0) {

			return; // return 5: wrong access token, invalid request'
		}

		if ($password == "") {
			$data = array (
					'name' => $fullname,
					'date_of_birth' => $dob,
					'profile_photo' => $profile_photo,
					'gender' => $gender,
					'phone_number' => $phonenumber,
					'created_date_time' => date ( "Y-m-d H:i:s" )
			);
		} else {

			$data = array (
					'name' => $fullname,
					'password' => md5 ( $password ),
					'date_of_birth' => $dob,
					'profile_photo' => $profile_photo,
					'gender' => $gender,
					'phone_number' => $phonenumber,
					'created_date_time' => date ( "Y-m-d H:i:s" )
			);
		}
		$this->db->where ( 'user_id', $user_id );
		$this->db->update ( 'users', $data );

		$result = $this->db->affected_rows ();

		return $result;
	}

	/**
	 * @author Manju.
	 * @purpose to update user in DB.
	 */
	public function check_access_token($access_token) {
		$this->db->where ( "access_token", $access_token );
		$query = $this->db->get ( "users" );
		return $query->num_rows ();
	}
}
?>