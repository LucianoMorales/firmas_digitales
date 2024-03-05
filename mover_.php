<?php

$directorio_temp = 'temp/';
$directorio = 'archivos_firmados/';


if (!empty($_POST['file'])){
    $data = base64_decode($_POST['file']);
    $nombre = ($_POST['file']);
    $file_path = 'Z:/05. Clínica/5.4 Resultados/2023/ultrasonidos/' . $_POST['nombre'];
    file_put_contents($file_path ,$data);
    echo("guardado");
}
else{
echo"No se enviaron datos";
}



?>