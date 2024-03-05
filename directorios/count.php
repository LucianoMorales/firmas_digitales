<?php
$dir = '../archivo_cache/';
$count = 0;

if ($handle = opendir($dir)) {
  while (($file = readdir($handle)) !== false) {
    if (!in_array($file, array('.', '..')) && !is_dir($dir . $file)) {
      $extension = pathinfo($file, PATHINFO_EXTENSION);
      if ($extension == 'pdf') {
        $count++;
      }
    }
  }
  closedir($handle);
}

echo $count;
?>