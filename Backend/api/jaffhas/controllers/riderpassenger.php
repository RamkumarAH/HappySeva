<?php
if (! defined ( 'BASEPATH' ))
	exit ( 'No direct script access allowed' );

require APPPATH . '/libraries/REST_Controller.php';
class Riderpassenger extends REST_Controller {
	
	/**
	 * author: Manju
	 * purpose: constructor for the Wishlist controller class
	 */
	public function __construct() {
		parent::__construct ();
		$this->load->model ( 'riderpassenger_model' );
		// $this->load->model('user_model');
	}
	
	/**
	 * author: Manju
	 * purpose: to get all the wishlists of a user
	 */
	function fetch_ride_get() {
		$message = array ();
		
		// call "get_wishlist" function to get the list of wishlist created by user.
		
		$access_token = $this->input->get ( 'access_token' );
		
		$lists = $this->riderpassenger_model->rides ( $access_token );
		
		// Return:2 Invalid request
		// list empty: no wishlist found.
		// list foung: send the wishlists in list array.
		if ($lists == 2) {
			
			$message ['message'] = 'Invalid request';
			$message ['status'] = false;
		}
		
		// store all the wishlists in array
		$message ['lists'] = $lists;
		
		// check for empty wishlist
		if (empty ( $lists )) {
			
			$message ['message'] = 'no riders found';
			$message ['status'] = false;
		}
		
		$this->response ( $message, 200 );
	}
	
	/**
	 * author: Manju
	 * purpose: to get all the wishlists of a user
	 */
	function create_ride_post() {
		$message = array ();
		
		// get the values through post
		$access_token = $this->post ( 'access_token' );
		$rider_user_id = $this->post ( 'rider_user_id' );
		$source = $this->post ( 'source' );
		$destination = $this->post ( 'destination' );
		$price = $this->post ( 'price' );
		$depart_time = $this->post ( 'depart_on_date_time' );
		
		// call a model function to create a new wishlist in the DB.
		$create_ride = $this->riderpassenger_model->create_ride ( $access_token, $rider_user_id, $source, $destination, $price, $depart_time );
		
		// if result:1 wishlist is sucessfully created.
		// if result:0 wishlist already exists.
		// if result:2 user invalid request.
		if ($create_ride == '1') {
			$message ['message'] = 'ride is successfully created';
			$message ['status'] = true;
		}
		
		$this->response ( $message, 200 ); // send the final response array.
	}
	
	/**
	 * author: Manju
	 * purpose: to get all the wishlists of a user
	 */
	function ptor_post() {
		$message = array ();
		
		// get the values through post
		$access_token = $this->post( 'access_token');
		$passenger_user_id = $this->post('passenger_user_id');
		$rider_user_id = $this->post('rider_user_id');
		$pickup_point = $this->post('pickup_point');
		$drop_point = $this->post('drop_point');
		$when_to_pickup = $this->post('when_to_pickup');
		$status = $this->post('status');
		$request_time_sent = $this->post('request_time_sent');
		
		// call a model function to create a new wishlist in the DB.
		$create_ride = $this->riderpassenger_model->add_ptor ( $access_token, $passenger_user_id, $rider_user_id, $pickup_point, $drop_point, $when_to_pickup, $status, $request_time_sent );
		
		// if result:1 wishlist is sucessfully created.
		// if result:0 wishlist already exists.
		// if result:2 user invalid request.
		if ($create_ride) {
			
			$message ['message'] = 'Passenger to Rider request sent';
			$message ['status'] = true;
		} else {
			
			$message ['message'] = 'Invalid Request';
			$message ['status'] = false;
		}
		
		$this->response ( $message, 200 ); // send the final response array.
	}
	function rtop_post() {
		$message = array ();
		
		// get the values through post
		$access_token = $this->post ( 'access_token' );
		$passenger_user_id = $this->post ( 'passenger_user_id' );
		$rider_user_id = $this->post ( 'rider_user_id' );
		$pickup_point = $this->post ( 'pickup_point' );
		$drop_point = $this->post ( 'drop_point' );
		$when_to_pickup = $this->post ( 'when_to_pickup' );
		$status = $this->post ( 'status' );
		$request_time_sent = $this->post ( 'request_time_sent' );
		
		$ptor = $this->riderpassenger_model->rider_to_passenger ( $access_token, $passenger_user_id, $rider_user_id, $pickup_point, $drop_point, $when_to_pickup, $status, $request_time_sent );
		
		if ($ptor) {
			
			$message ['message'] = 'Rider to Passenger request sent';
			$message ['status'] = true;
		} else {
			
			$message ['message'] = 'Invalid Request';
			$message ['status'] = false;
		}
		
		$this->response ( $message, 200 ); // send the final response array.
	}
	function upcoming_rides_get() {
		$message = array ();
		
		$access_token = $this->get ( 'access_token' );
		
		$list = $this->riderpassenger_model->upcoming_ride ( $access_token );
		
		$message ['list'] = $list;
		
		$this->response ( $message, 200 ); // send the final response array.
	}
	
	/**
	 * author: Manju
	 * purpose: to add items to the wishlist
	 */
	function add_item_post() {
		$message = array ();
		
		// get all the values through post
		$access_token = $this->post ( 'access_token' );
		$wishlist_id = $this->post ( 'wishlist_id' );
		$item_code = $this->post ( 'item_code' );
		$item_name = $this->post ( 'item_name' );
		$item_price = $this->post ( 'item_price' );
		$item_description = $this->post ( 'item_description' );
		$image_url = $this->post ( 'image_url' );
		
		$wishlist_name = ''; // initialize the wishlist variable to null
		
		if ($wishlist_id == 0) {
			$wishlist_name = $this->post ( 'wishlist_name' );
		} // if the wishlistid is 0, get the wishlistname
		  
		// call the "add_item_to_wishlist" function to add item to wishlist table
		$result = $this->wishlist_model->add_item_to_wishlist ( $access_token, $item_code, $item_name, $item_price, $item_description, $wishlist_id, $image_url, $wishlist_name );
		
		// if the result is 1 or 2 then item is successfully added to the wishlist
		// result 1: item already exists just add in the mapping table.
		// result 2: add item in items table, and add in mapping table also
		if ($result == 1 || $result == 2) {
			
			$message ['message'] = 'Item successfully added to the wishlist';
		}
		
		// result 3: item already exist in the wishlist
		if ($result == 3) {
			
			$message ['message'] = 'Item already added in this wishlist';
		}
		
		// result 4: the wishlist you are going to create is already exist
		if ($result == 4) {
			
			$message ['message'] = 'Wishlist Already Exists';
		}
		
		// Return:6 -> if wishlist that you are adding item doesnt exist.
		if ($result == 6) {
			
			$message ['message'] = 'Wishlist not exists';
		}
		
		// Return:7 -> for invalid request.
		if ($result == 7) {
			
			$message ['message'] = 'Invalid Request';
		}
		
		$this->response ( $message, 200 ); // send the final response array.
	}
	
	/**
	 * author: Manju
	 * purpose: to delete wishlist and mapping items of a user
	 */
	function delete_wishlist_post() {
		$message = array ();
		
		// get the wishlist through post method
		$wishlist_id = $this->post ( 'wishlist_id' );
		$access_token = $this->post ( 'access_token' );
		
		// call the function "delete_wishlist" to delete the wishlist in the DB.
		$delete_wishlist_check = $this->wishlist_model->delete_wishlist ( $access_token, $wishlist_id );
		
		if ($delete_wishlist_check == '5') {
			
			$message ['message'] = 'Invalid request';
			$message ['status'] = false;
		}
		
		// result:1 record exist and wishlist successfully deleted.
		// result:0 wishlist doesnt Exists.
		if ($delete_wishlist_check == '1') {
			$message ['message'] = 'wishlist is sucessfully deleted';
			$message ['status'] = true;
		}
		
		if ($delete_wishlist_check == '0') {
			
			$message ['message'] = 'wishlist doesnt Exists';
			$message ['status'] = false;
		}
		
		$this->response ( $message, 200 ); // send the final response array.
	}
}