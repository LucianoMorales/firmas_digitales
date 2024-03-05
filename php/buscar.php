<?php
$directorio = opendir("C:/xampp/htdocs/firmas_digital/archivo_cache/"); //ruta actual
// $directorio = opendir("Z:/07. Administración/Secretaria Administrativa/2023/INFORMES RADIOLOGO/");
$dire = 'C:/xampp/htdocs/firmas_digital/archivo_cache/';

$x=0;
while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
{
    if($archivo!="." && $archivo!=".."){

        if($x==0){
        echo $archivo ;
      
        $x=1;
        break;
        }
        else{

        }
}

}
$nombre_archivo=$archivo;
?>