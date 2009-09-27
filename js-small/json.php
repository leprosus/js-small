<?php
$callback = (isset($_GET['callback']) && ereg("^[a-zA-Z0-9]+$", $_GET['callback'])) ? $_GET['callback'] : "";
if(strlen($callback) > 0){
    $return = true;
    echo "{$callback}(".($return ? "true" : "false").");";
}
?>