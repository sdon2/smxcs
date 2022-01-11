<?php
namespace Controllers;

use Exceptions\AuthException;
use Exceptions\ApiException;
use Helpers\Session;
use Helpers\Password;

class Users extends AuthController
{
    function __construct() {
        parent::__construct();

        if (!$this->isAdmin() && !$this->isOwner()) {
            $this->throwError("Invalid operation");
        }
    }

    function getIndex()
    {
        // Do not list admin and owner users
        $sql = "SELECT Id, Username, Fullname, UserRole FROM users";
        $query = $this->db->query($sql);
        $users = $query->fetchAll();
        $this->setData($users);

        $this->render();
    }

    function getFind($id)
    {
        $sql = "SELECT Id, Username, Fullname, UserRole FROM users WHERE Id = ?";
        $user = $this->db->query($sql, [$id])->fetch();
        if (!$user) $this->throwError("User not found");

        $this->setData($user);
        $this->render();
    }

    private function preparePostData(&$postData)
    {
        if ($this->isAccountant() || $this->isBranch()) {
            $this->throwError("Invalid operation");
        }

        if ($this->isOwner()) {
            // goto password if changed user type is OWNER and Same User
            if ($postData['UserRole'] == OWNER && $postData['Id'] == $this->userdata->id) goto PASSWORD;
            if ($postData['Id'] == $this->userdata->id || $postData['UserRole'] == ADMIN || !\in_array($postData['UserRole'], [BRANCH, ACCOUNTANT])) {
                $this->throwError("Unexpected user role specified");
            }
        }          

        if ($this->isAdmin()) {
            // goto password if changed user type is ADMIN and Same User
            if ($postData['UserRole'] == ADMIN && $postData['Id'] == $this->userdata->id) goto PASSWORD;
            if ($postData['Id'] == $this->userdata->id || !\in_array($postData['UserRole'], [OWNER, BRANCH, ACCOUNTANT])) {
                $this->throwError("Unexpected user role specified");
            }
        }

        PASSWORD:
        
        if (!empty($postData['UserPassword'])) {
            if (\strcmp($postData['UserPassword'], $postData['CPassword']) !== 0) {
                $this->throwError("Password and confirm passwords must match");
            }
        }
        else {
            unset($postData['UserPassword']);
        }
        unset($postData['CPassword']);
    }

    function postCreate()
    {
        $postData = $this->jsonPost();

        $this->preparePostData($postData);

        $s_params_exploded = \array_keys($postData);
        $s_params = \implode(",", $s_params_exploded);
        $q_params = implode(",", \array_fill(0, count($s_params_exploded), "?"));
        $sql = "INSERT INTO users ({$s_params}) VALUES({$q_params})";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        $id = $this->db->insert($sql, $params);
        if (!$id) $this->throwError("Unable to add user");

        $this->setData($id);
        $this->setMessage("Success");
        $this->render();
    }

    function postUpdate()
    {
        $postData = $this->jsonPost();

        if (!isset($postData['Id']) || empty($postData['Id']))
            $this->throwError("Invalid user Id");

        $id = $postData['Id'];

        $this->preparePostData($postData);

        $s_params_exploded = \array_keys($postData);
        $s_params = \implode(",", $s_params_exploded);
        // For concatinating ? to the end of each coloumn name
        $s_params_exploded_1 = $s_params_exploded;
        \array_walk($s_params_exploded_1, function (&$item) {
            $item = "{$item} = ?";
        });
        $q_params = implode(",", $s_params_exploded_1);
        $sql = "UPDATE users SET {$q_params} WHERE Id = ? AND UserRole NOT IN (4)";
        $params = [];
        foreach ($s_params_exploded as $param) {
            \array_push($params, $postData[$param]);
        }
        // Finally push id
        \array_push($params, $id);

        // Update consignment
        $result = $this->db->update($sql, $params);

        $result = ['result' => $result, 'reLogin' => false];

        if ($result && $this->userdata->id == $postData['Id']) {
          $result['reLogin'] = true;
        }

        $this->setData($result);
        $this->setMessage("Success");
        $this->render();
    }

    function postDelete()
    {
        $postData = $this->jsonPost();

        if (!isset($postData['Id']) || empty($postData['Id']))
            $this->throwError("Invalid user Id");

        $id = $postData['Id'];

        $sql = "DELETE FROM users WHERE Id = ? AND UserRole NOT IN (3, 4)";
        $result = $this->db->delete($sql, [$id]);

        $this->setData($result);
        $this->setMessage("Success");
        $this->render();
    }
}