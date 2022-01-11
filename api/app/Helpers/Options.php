<?php namespace Helpers;

class Options
{
    /**
     * @var \Helpers\DB
     */
    private $db;

    function setDatabaseConnection($db) {
        $this->db = $db;
    }

    function setOption(string $optionName, string $value) {
        $s_query = "SELECT `Option` FROM options WHERE `Option` = ?";
        if($this->db->query($s_query, [$optionName])->fetch()) {
            $u_query = "UPDATE options SET `Value` = ? WHERE `Option` = ?";
            $this->db->update($u_query, [$value, $optionName]);
        }
        else {
            $i_query = "INSERT INTO options (`Option`, `Value`) VALUES (?, ?)";
            $this->db->insert($i_query, [$optionName, $value]);
        }
    }

    function getOption(string $optionName) {
        $s_query = "SELECT `Value` FROM options WHERE `Option` = ?";
        $result = $this->db->query($s_query, [$optionName])->fetch();
        if ($result) {
            return $result['Value'];
        }
        return null;
    }
}