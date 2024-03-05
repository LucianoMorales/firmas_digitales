<?php
$directorio = opendir("Z:/05. Clínica/5.4 Resultados/2022/Ultrasonidos/"); //ruta actual
$cache = 'C:/xampp/htdocs/firmas_digital/archivo_cache/';
$dire = 'Z:/05. Clínica/5.4 Resultados/2022/Ultrasonidos/';

$x=0;
while ($archivo = readdir($directorio)) //obtenemos un archivo y luego otro sucesivamente
{
    if($archivo!="." && $archivo!=".."){

        if($x==0){

        echo $archivo ;
        
        $moved = rename($dire.$archivo, $cache.$archivo);
        $x=1;
        break;
        }
        else{

            
        }
      
     
    
  
}


}
?>