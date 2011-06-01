<?php
ob_start();
print_r($_FILES);
$content = ob_get_contents();
ob_end_clean();

//$file = fopen("D:/console.txt", "w+");
//fwrite($file, date('r')."\n\n".$content);
//fclose($file);
?>
OK