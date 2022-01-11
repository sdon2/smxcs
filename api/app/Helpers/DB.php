<?php
namespace Helpers;

class DB
{
    /**
     * @var \PDO
     */
    private $conn;

    function __construct(string $host, string $db, string $user, string $password) {
        $this->conn = new \PDO("mysql:host={$host};dbname={$db}", $user, $password);
        $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        $this->conn->setAttribute(\PDO::ATTR_EMULATE_PREPARES, false);
        $this->conn->setAttribute(\PDO::ATTR_STRINGIFY_FETCHES, false);
    }

    /**
     * @return \PDOStatement
     */
    function query(String $sql, array $params = array()) {
        $stmt = $this->conn->prepare($sql);
        if (!empty($params)) {
            $stmt->execute($params);
        } else {
            $stmt->execute();
        }
        $stmt->setFetchMode(\PDO::FETCH_ASSOC);
        return $stmt;
    }

    /**
     * @return int
     */
    private function exec(String $sql, array $params = array()) {
        $stmt = $this->conn->prepare($sql);
        if (!empty($params)) {
            $stmt->execute($params);
        } else {
            $stmt->execute();
        }
        return $stmt->rowCount();
    }

    /**
     * @return int
     */
    function delete(String $sql, array $params = array()) {
        return $this->exec($sql, $params);
    }

    /**
     * @return int
     */
    function update(String $sql, array $params = array()) {
        return $this->exec($sql, $params);
    }

    /**
     * @return int
     */
    function insert(String $sql, array $params = array()) {
        if (!$this->exec($sql, $params)) return 0;
        return (int)$this->conn->lastInsertId();
    }

}
