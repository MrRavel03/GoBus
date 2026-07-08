<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$rutas = [
    [
        "id" => 1,
        "origen" => "San José",
        "destino" => "Cartago",
        "empresa" => "Lumaca",
        "tipo" => "Urbano",
        "tarifa" => 1400,
        "frecuencia" => "Cada 25 min",
        "estado" => "Activa"
    ],
    [
        "id" => 2,
        "origen" => "San José",
        "destino" => "Heredia",
        "empresa" => "Busetas Heredianas",
        "tipo" => "Urbano",
        "tarifa" => 720,
        "frecuencia" => "Cada 15 min",
        "estado" => "Activa"
    ],
    [
        "id" => 3,
        "origen" => "San José",
        "destino" => "Alajuela",
        "empresa" => "Tuasa",
        "tipo" => "Urbano",
        "tarifa" => 680,
        "frecuencia" => "Cada 15 min",
        "estado" => "Activa"
    ],
    [
        "id" => 4,
        "origen" => "San José",
        "destino" => "Liberia",
        "empresa" => "Pulmitan",
        "tipo" => "Interurbano",
        "tarifa" => 4500,
        "frecuencia" => "Cada 2 horas",
        "estado" => "En revisión"
    ]
];

echo json_encode($rutas, JSON_UNESCAPED_UNICODE);
?>