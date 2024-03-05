<?php
$directorio = opendir("Z:/07. Administración/Secretaria Administrativa/2023/INFORMES RADIOLOGO/"); //ruta actual
$cache = 'C:/xampp/htdocs/firmas_digital/archivo_cache/';


$dire = 'Z:/07. Administración/Secretaria Administrativa/2023/INFORMES RADIOLOGO/';

$x=0;
while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
{
    if($archivo!="." && $archivo!=".."){
        $moved = rename($dire.$archivo, $cache.$archivo);
        $x= $x+1;
}
}
if ($x==0){
echo("No se encuentran archivos para subir");
}
else{
    echo "Se subieron ". $x . " exámenes que ahora podrán editar";
}
?>