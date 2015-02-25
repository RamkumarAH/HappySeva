<?php
if (!defined('BASEPATH'))
    exit ('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';

interface AuthenticationInterface {

    public function authentication_api_post();
}

class Authentication extends REST_Controller implements AuthenticationInterface {

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
        purpose: constructor for the Authentication controller class
     */
    public function __construct() {
        parent :: __construct();
    }

    function authentication_api_post() {

        $message = array ();
        $access_token_post = $this->post('access_token');
        $access_token_db = $this->session->userdata('access_token');

        if (!isset ($access_token_post)) {
               $message['access_token'] = false;
        } else {

            if ($access_token_post == $access_token_db) {
                $message['access_token'] = true;

            } else {
                $message['access_token'] = false;
            }

        }

        $this->response($message, 200);

    }

}

/* End of file Authentication.php */
/* Location: ./application/controllers/Authentication.php */