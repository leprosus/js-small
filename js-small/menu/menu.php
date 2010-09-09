<?php
$callback = isset($_GET['callback']) && preg_match("/[a-z0-9]+/i", $_GET['callback']) ? $_GET['callback'] : null;
if($callback != null) {
    $menu = array(
            array(
                    "id" => 1,
                    "parent" => null,
                    "text" => "Меню 1",
                    "link" => "evalab.ru",
                    "target" => "self",
                    "image" => ""
            ),
            array(
                    "id" => 2,
                    "parent" => null,
                    "text" => "Меню 2",
                    "link" => "evalab.ru",
                    "target" => "self",
                    "image" => ""
            ),
            array(
                    "id" => 3,
                    "parent" => null,
                    "text" => "Меню 2",
                    "link" => "evalab.ru",
                    "target" => "self",
                    "image" => ""
            ),
            array(
                    "id" => 4,
                    "parent" => null,
                    "text" => "Меню 3",
                    "link" => "evalab.ru",
                    "target" => "self",
                    "image" => ""
            ),
            array(
                    "id" => 5,
                    "parent" => 1,
                    "text" => "Подменю 11",
                    "link" => "evalab.ru",
                    "target" => "self",
                    "image" => ""
            ),
            array(
                    "id" => 6,
                    "parent" => 2,
                    "text" => "Подменю 21",
                    "link" => "evalab.ru",
                    "target" => "self",
                    "image" => ""
            ),
            array(
                    "id" => 7,
                    "parent" => 6,
                    "text" => "Подменю 212",
                    "link" => "evalab.ru",
                    "target" => "self",
                    "image" => ""
            ),
            array(
                    "id" => 8,
                    "parent" => 2,
                    "text" => "Подменю 22",
                    "link" => "evalab.ru",
                    "target" => "self",
                    "image" => ""
            )
    );
    echo $callback."(".json_encode($menu).");";
}
?>