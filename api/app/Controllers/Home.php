<?php namespace Controllers;

class Home extends BaseController
{
    function getIndex()
    {
        $this->setMessage("Success");
        $this->render();
    }

    function postLogin()
    {
        $postData = $this->jsonPost();
        
        $userName = $postData['Username'];
        $password = $postData['UserPassword'];

        $result = $this->db->query('SELECT Id as `id`, Fullname as `fullname`, UserRole as `role` FROM users WHERE Username = ? AND UserPassword = ?', [$userName, $password])->fetch();

        if (!$result) {
            $this->setError('Incorrect Username or password. Try again!!');
            $this->render();
        }
        else {
            $date = new \DateTime();
            $date->add(new \DateInterval('P1D'));
            $result['exp'] = $date->getTimestamp();
            $this->setData(['token' => \Helpers\Auth::generateToken($result)]);
            $this->render();
        }

    }
}