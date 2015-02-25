<?php
if (!defined('BASEPATH'))
    exit ('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

interface UserInterface {

    public function user_login_post();
    public function logout_get();
    public function register_post();
    public function getuser_info_get();
    public function update_userinfo_post();
}

class User extends REST_Controller implements UserInterface {
    //class User extends REST_Controller implements UserInterface {

    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     *         http://example.com/index.php/User
     *    - or -
     *         http://example.com/index.php/User/index
     *    - or -
     * Since this controller is set as the default controller in
     * config/routes.php, it's displayed at http://example.com/
     *
     * So any other public methods not prefixed with an underscore will
     * map to /index.php/welcome/<method_name>
     * @see http://codeigniter.com/user_guide/general/urls.html
     */

    /** author: Manju
        purpose: constructor for the user controller class
     */
    public function __construct() {

        parent :: __construct();
        $this->load->model('user_model');
        $this->load->library('Common_Methods');
       // $this->output->enable_profiler(TRUE);
    }

    public function index() {
        $this->load->view('lol');
    }
    /**
       * @author Manju.
       * @purpose  Check after login form api.
       */
    function user_login_post() {

        $message = array ();
        $message['status'] = false;

        //load the form_validation library
        $this->load->library('form_validation');

        //server side validation for email and password
        $this->form_validation->set_rules('email', 'Your Email', 'trim|required|valid_email');
        $this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[4]|max_length[32]');

        $this->form_validation->set_error_delimiters('', '');

        //check whether validation success or fail
        $validated = $this->form_validation->run();
        $validated = true;
        //if validation is success
        if ($validated) {

            $email = $this->post('email');
            $password = md5($this->post('password'));

            //function to check for login success
            $result = $this->user_model->login($email, $password);

            //if login success send 'Login Successfull' and access_token in response.
            if ($result) {

                $message['status'] = true;
                $message['message'] = 'Login Successfull';
                $message['access_token'] = $this->session->userdata('access_token');

            } else {
               //for login unsuccess
                $message['errors'] = 'The email/password combination entered is invalid.';
                $message['message'] = 'Invalid Login';

            }
        } else {
            //send the validation in response
            $message['errors'] = validation_errors();
        }

        echo $this->response($message, 200); //send the final response array.
    }

    /**
     * @author Manju.
     * @purpose  function to logout.
     */
    public function logout_get() {

        $output = array ();
        $output['status'] = true;
        $output['message'] = 'you are successfully logged out';

       //set the session variables to null
        $newdata = array (
            'user_id' => '',
            'user_name' => '',
            'email' => '',
            'access_token' => '',
            'logged_in' => FALSE,


        );

        //unset the session array.
        $this->session->unset_userdata($newdata);
        $this->session->sess_destroy();

        return $this->response($output, 200); //send the final response array.

    }

    /**
       * @author Manju.
       * @purpose  function to register new user.
      */
    public function register_post() {

        //load the form_validation library
        $this->load->helper(array('form', 'url'));
        $this->load->library('form_validation');
        $output = array ();
        $output['status'] = false;

        //server side validation for registeration fields
        $this->form_validation->set_rules('fullname', 'Name', 'trim|required|min_length[4]|xss_clean');
        $this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email');
        $this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[4]|max_length[32]');
        $this->form_validation->set_rules('confirmation', 'Password Confirmation', 'trim|required|matches[password]');
        $this->form_validation->set_rules('phonenumber', 'Phone Number', 'trim|required');

        //check for validation success or failure
        $validated = $this->form_validation->run();
        $validated = true;
         //for validation success
          if ($validated) {

            $name = $this->post ( 'fullname' );
			$email = $this->post ( 'email' );
			$password = $this->post ( 'password' );
			$phonenumber = $this->post ( 'phonenumber' );


            //add the new user in the DB
            $result = $this->user_model->add_user($name, $email, $password,$phonenumber);

            //IF user is successfully added in db
            if ($result) {

                $output['status'] = true;
                $output['message'] = 'user is successfully registered';

            } else {
              //if email already exists
                $output['status'] = false;
                $output['message'] = 'email-id already exists';

            }

        } else {

            //send the validation errors
             $output['errors'] = validation_errors();
        }

        echo $this->response($output, 200);  //send the final response array.
    }



    /**
       * @author Manju.
       * @purpose  function to edit user profile.
      */
    public function getuser_info_get() {

        //$output = array ();
        //$output['status'] = true;

        $access_token = $this->input->get('access_token');
        //Function to get user details from DB
        $output = $this->user_model->get_user_details($access_token);


        if(empty($output)) { //check if user details are empty

           $output['status'] = false;
           $output['message'] = 'user details not found';
        }

        $this->response($output, 200); //send the final response array.
    }

    /**
       * @author Manju.
       * @purpose  function to edit user profile.
      */
    public function update_userinfo_post() {

        //load the form_validation library
        $this->load->library('form_validation');
        $output = array ();
        $output['status'] = false;

        //server side validation for fields
       //$this->form_validation->set_rules('fullname', 'Name', 'trim|required|min_length[4]|xss_clean');
       //$this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email');
       //$this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[4]|max_length[32]');
       //$this->form_validation->set_rules('confirmation', 'Password Confirmation', 'trim|required|matches[password]');

        //$this->form_validation->set_rules('dob', 'DOB', 'trim|required');

        //check whether validation success or failure

        $validated = true;



        //if validation success
        if ($validated) {

   			$access_token = $this->post('access_token') ;
            $fullname = $this->post ( 'fullname' );
			$dob = $this->post ( 'date_of_birth' );
			$profile_photo = $this->post ( 'profile_photo' );
			$gender = $this->post ( 'gender' );
			$password = $this->post ( 'password' );
			$phonenumber = $this->post ( 'phonenumber' );


            //update the user in DB and send the response
            $user_update = $this->user_model->user_update($access_token,$fullname, $dob,$profile_photo,$gender,$password, $phonenumber);

            //Return:1 if user is successfully updated.
            //Return:0 if user is not updated.
            if($user_update){

               $output['status'] = true;
               $output['message'] = 'UserInfo is successfully updated';
            } else {

               $output['status'] = false;
               $output['message'] = 'user is not updated';
            }

        } else {

            //send the validation errors in response
            $output['errors'] = validation_errors();
        }

       return $this->response($output, 200); //send the final response array.
    }

}

/* End of file user.php */
/* Location: ./application/controllers/user.php */