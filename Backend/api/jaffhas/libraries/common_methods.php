<?php

class Common_Methods {

    public function random_id($appendval = '', $length = 20) {
        $rand = rand().crypt(md5(time())).rand(0, 9).time().sha1(crypt(time())).strtotime(date('Y-m-d'));
        $randvalue = $appendval.$rand;
        $randvalue = substr($randvalue, 0, $length);
        return trim(md5($randvalue));
    }

    public function encrypt_value($value) {
        //
        $salt = 'HINTHINTENCRYPTION1234567890';
        return md5(sha1(crypt($value, $salt)));
    }

    public function curl_post($url, $data) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $method = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        return $method;
    }

    public function curl_get($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $method = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        return $method;
    }

}