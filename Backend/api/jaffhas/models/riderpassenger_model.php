<?php
class Riderpassenger_Model extends CI_Model {
	
	/**
	 *
	 * @author Manju
	 *         @purpose constructor for Wishlist_Model
	 */
	function __construct() {
		parent::__construct ();
		$this->load->database ();
		// error_reporting(0);
	}
	
	/**
	 *
	 * @author Manju
	 *         @purpose Array it will get all wishlists of a user based on access_token
	 *         return: array()
	 */
	function rides($access_token) {
		$lists = array ();
		
		// get user_id by passing access_token.
		$user_id = $this->get_userid ( $access_token );
		
		if ($user_id == 0) {
			return 2; // return 2: wrong access token, user doesn't exist'
		}
		
		// query to get wishlist based on user access_token
		$this->db->select ( '*' );
		$this->db->from ( 'rides' );
		$this->db->where ( 'rider_user_id', $user_id );
		
		$rides = $this->db->get ();
		
		// store all wishlist in list array
		foreach ( $rides->result () as $row ) {
			$lists [] = $row;
		}
		
		return $lists;
	}
	
	/**
	 *
	 * @author Manju
	 *         @purpose to create a wishlist in to the db
	 */
	function create_ride($access_token, $rider_user_id, $source, $destination, $price, $depart_time) {
		
		// get user_id by passing access_token.
		$user_id = $this->get_userid ( $access_token );
		
		if ($user_id == 0) {
			
			return 2; // return 2: wrong access token, user doesn't exist'
		}
		
		// Query to create new wishist in DB. Return:True if wishlist is created
		$data = array (
				'rider_user_id' => $rider_user_id,
				'source' => $source,
				'destination' => $destination,
				'price' => $price,
				'depart_on_date_time' => $depart_time,
				'created_date_time' => date ( "Y-m-d H:i:s" ) 
		);
		
		$this->db->insert ( 'rides', $data );
		
		return TRUE;
	}
	function add_ptor($access_token, $passenger_user_id, $rider_user_id, $pickup_point, $drop_point, $when_to_pickup, $status, $request_time_sent) {
		
		// get user_id by passing access_token.
		$user_id = $this->get_userid ( $access_token );
		
		if ($user_id == 0) {
			
			return false; // return 2: wrong access token, user doesn't exist'
		}
		
		$data = array (
				'passenger_user_id' => $passenger_user_id,
				'rider_user_id' => $rider_user_id,
				'pickup_point' => $pickup_point,
				'drop_point' => $drop_point,
				'when_to_pickup' => $when_to_pickup,
				'status' => $status,
				'request_time_sent' => $when_to_pickup,
				'created_date_time' => date ( "Y-m-d H:i:s" ) 
		);
		
		$this->db->insert ( 'passenger_to_rider_request', $data );
		
		
		return TRUE;
	}
	function rider_to_passenger($access_token, $passenger_user_id, $rider_user_id, $pickup_point, $drop_point, $when_to_pickup, $status, $request_time_sent) {
		// get user_id by passing access_token.
		$user_id = $this->get_userid ( $access_token );
		
		if ($user_id == 0) {
			return false; // return 2: wrong access token, user doesn't exist'
		}
		
		// Query to create new wishist in DB. Return:True if wishlist is created
		$data = array (
				'passenger_user_id' => $passenger_user_id,
				'rider_user_id' => $rider_user_id,
				'pickup_point' => $pickup_point,
				'drop_point' => $drop_point,
				'when_to_pickup' => $when_to_pickup,
				'status' => $status,
				'request_time_sent' => date ( 'Y-m-d H:i:s' ) 
		);
		
		$this->db->insert ( 'rider_to_passenger_request', $data );
		
		return true;
	}
	function upcoming_ride($access_token) {
		$user_id = $this->get_userid ( $access_token );
		
		if ($user_id == 0) {
			return false; // return 2: wrong access token, user doesn't exist'
		}
		
		// query to fetch user_id based on access_token
		$where = array (
				"rider_user_id" => $user_id,
				"DATE(depart_on_date_time)" => date ( 'Y-m-d' ),
				"TIME(depart_on_date_time) > " => date ( "H:i:s" ) 
		);
		
		$this->db->select ( '*' );
		$this->db->where ( $where );
		
		$query = $this->db->get ( "rides" );
		
		// echo $this->db->last_query(); exit;
		
		foreach ( $query->result () as $row ) {
			$rows [] = $row;
		}
		
		return $rows; // return user_id
	}
	
	/**
	 *
	 * @author Manju
	 *         @purpose get user id based on the access token
	 *         return: integer
	 */
	function get_userid($access_token) {
		$user_id = 0;
		// query to fetch user_id based on access_token
		$this->db->select ( 'user_id' );
		$this->db->where ( "access_token", $access_token );
		$query = $this->db->get ( "users" );
		
		foreach ( $query->result () as $row ) {
			$user_id = $row->user_id;
		}
		
		return $user_id; // return user_id
	}
}