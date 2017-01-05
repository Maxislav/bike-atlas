<?php


/**
 * GET /?alt=0.0&code=0xF020&id=123456789012345&gprmc=%24GPRMC%2C191019.951%2CA%2C5023.32513%2CN%2C3029.62911%2CE%2C0.000000%2C0.000000%2C301213%2C%2C*3A HTTP/1.1
 Host: 31.131.16.130:10100
 Connection: Keep-Alive
 User-Agent: android-async-http/1.4.1 (http://loopj.com/android-async-http)
 Accept-Encoding: gzip
*/
$_id = $_GET["id"];
$gprmc= $_GET["gprmc"];
//$gprmc = $GPRMC,074559.236,A,5023.32224,N,3029.63120,E,0.000000,0.000000,290314,,*3C


$text = "Этот текст запишем в файл.";

$arr = explode(",", $gprmc);

if($arr[4]=='N'){
    $lat =  $arr[3];
}else{
    $lat = (-1)*$arr[3];
}

$lat = $lat/100;
$arr_lat = explode(".", $lat);
$mm = $arr_lat[1];
$mm =100 * $mm/60;
$mm= round($mm);
$lat = $arr_lat[0].'.'.$mm;
$lat = round($lat, 5);

if($arr[6]=='E'){
    $lng = $arr[5];
}else{
    $lng = (-1)*$arr[5];
}

$lng = $lng/100;
$arr_lng = explode(".", $lng);
$mm = $arr_lng[1];
$mm =100 * $mm/60;
$mm= round($mm);
$lng = $arr_lng[0].'.'.$mm;
$lng = round($lng, 5);


$date = $arr[9];

$arr_date = preg_split('//', $date, -1, PREG_SPLIT_NO_EMPTY);
$date = "".$arr_date[4].$arr_date[5].$arr_date[2].$arr_date[3].$arr_date[0].$arr_date[1];

$time = explode(".",$arr[1]);
$time = "".$time[0];
$arr_time = preg_split('//', $time, -1, PREG_SPLIT_NO_EMPTY);

$dateTime ="".$date.$time;


$speed = $arr[7];
$speed = $speed*1.85200;
$speed = round($speed,1);

$azimuth = $arr[8];

$sputnik = '';

$zaryad = '' ;
$tc = '';

//////////////////////////////

$config_sql=file_get_contents("../../config_sql.txt");
$arr_config_sql=  explode("!",$config_sql);
//$hostname = 'localhost';
$hostname= "$arr_config_sql[1]";


$username = "$arr_config_sql[2]";


$password = "$arr_config_sql[3]";

$db = mysql_connect($hostname, $username, $password) //соединение с базой данных
or die('connect to database failed');
$table_db=	"$arr_config_sql[4]";
mysql_select_db($table_db) or die('db not found'); //соединение  с базой данных

////////////////////////////




$tableBd="log";

$sql = "INSERT INTO `$table_db`.`$tableBd` (`id`, `imei`, `lat`, `lng`, `speed`, `datetime`, `zaryad`, `azimuth`, `sputnik`)
VALUES (NULL, '$_id','$lat', '$lng','$speed', '$dateTime', '$zaryad', '$azimuth', '$sputnik');";

if (!mysql_query($sql,$db))
{
    die('Error: ' . mysql_error());
    echo "erroddr";
}


mysql_close($db);

$getdata = http_build_query($_GET);
$opts = array('http' =>
 array(
     'method'  => 'GET',
     'content' => $getdata
 )
);

$context  = stream_context_create($opts);
$servletURL  = "http://178.62.44.54/log"."?".$getdata;
$result = file_get_contents($servletURL);
echo  $result;


//echo 'dss'.$result;
//echo  $servletURL;

//$h = fopen("log.txt","w");

//$log = $gprmc."   id:".$_id." "."dateTime:".$dateTime."\r\n";
//file_put_contents("log.txt", $log, FILE_APPEND | LOCK_EX);

//$fp = fopen('log.txt', 'a');
//fwrite($fp, $_POST['info']."\n");
//fclose($fp);


//if (fwrite($h,$dateTime))
//    echo "success";
//else
//    echo "erroddr";
//fclose($h);



?>