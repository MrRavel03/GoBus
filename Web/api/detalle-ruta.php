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
        "frecuencia" => "Cada 10 min",
        "estado" => "Activa",
        "telefono" => "2537-0000",
        "email" => "info@lumaca.com",
        "horarios" => [
            [
                "dia" => "Lunes a Viernes",
                "primerServicio" => "04:00 AM",
                "ultimoServicio" => "11:00 PM",
                "frecuencia" => "Cada 10 min"
            ],
            [
                "dia" => "Sábados",
                "primerServicio" => "04:30 AM",
                "ultimoServicio" => "11:00 PM",
                "frecuencia" => "Cada 15 min"
            ],
            [
                "dia" => "Domingos y Feriados",
                "primerServicio" => "05:00 AM",
                "ultimoServicio" => "10:00 PM",
                "frecuencia" => "Cada 20-30 min"
            ]
        ],
        "paradas" => [
            [
                "nombre" => "Terminal San José",
                "descripcion" => "Salida desde la terminal principal en San José."
            ],
            [
                "nombre" => "San Pedro",
                "descripcion" => "Parada cercana al Mall San Pedro."
            ],
            [
                "nombre" => "Curridabat",
                "descripcion" => "Parada en la zona de Curridabat."
            ],
            [
                "nombre" => "Tres Ríos",
                "descripcion" => "Parada principal en el centro de Tres Ríos."
            ],
            [
                "nombre" => "Terminal Cartago",
                "descripcion" => "Llegada al centro de Cartago."
            ]
        ]
    ],
    [
        "id" => 2,
        "origen" => "San José",
        "destino" => "Heredia",
        "empresa" => "Busetas Heredianas",
        "tipo" => "Urbano",
        "tarifa" => 720,
        "frecuencia" => "Cada 10 min",
        "estado" => "Activa",
        "telefono" => "2260-0000",
        "email" => "info@busetasheredianas.com",
        "horarios" => [
            [
                "dia" => "Lunes a Viernes",
                "primerServicio" => "05:00 AM",
                "ultimoServicio" => "10:30 PM",
                "frecuencia" => "Cada 10 min"
            ],
            [
                "dia" => "Sábados",
                "primerServicio" => "05:30 AM",
                "ultimoServicio" => "10:00 PM",
                "frecuencia" => "Cada 20 min"
            ],
            [
                "dia" => "Domingos y Feriados",
                "primerServicio" => "06:00 AM",
                "ultimoServicio" => "09:00 PM",
                "frecuencia" => "Cada 30 min"
            ]
        ],
        "paradas" => [
            [
                "nombre" => "Terminal San José",
                "descripcion" => "Salida desde la terminal en San José."
            ],
            [
                "nombre" => "La Uruca",
                "descripcion" => "Parada intermedia en La Uruca."
            ],
            [
                "nombre" => "Castella",
                "descripcion" => "Parada cercana al Conservatorio Castella."
            ],
            [
                "nombre" => "Heredia Centro",
                "descripcion" => "Llegada al centro de Heredia."
            ]
        ]
    ],
    [
        "id" => 3,
        "origen" => "San José",
        "destino" => "Alajuela",
        "empresa" => "Tuasa",
        "tipo" => "Urbano",
        "tarifa" => 680,
        "frecuencia" => "Cada  min",
        "estado" => "Activa",
        "telefono" => "2442-0000",
        "email" => "info@tuasa.com",
        "horarios" => [
            [
                "dia" => "Lunes a Viernes",
                "primerServicio" => "04:30 AM",
                "ultimoServicio" => "11:00 PM",
                "frecuencia" => "Cada 10 min"
            ],
            [
                "dia" => "Sábados",
                "primerServicio" => "05:00 AM",
                "ultimoServicio" => "10:30 PM",
                "frecuencia" => "Cada 10 min"
            ],
            [
                "dia" => "Domingos y Feriados",
                "primerServicio" => "05:30 AM",
                "ultimoServicio" => "10:00 PM",
                "frecuencia" => "Cada 15-20 min"
            ]
        ],
        "paradas" => [
            [
                "nombre" => "Terminal San José",
                "descripcion" => "Salida desde la terminal principal en San José."
            ],
            [
                "nombre" => "Hospital México",
                "descripcion" => "Parada cercana al Hospital México."
            ],
            [
                "nombre" => "Aeropuerto Juan Santamaría",
                "descripcion" => "Parada cercana al aeropuerto."
            ],
            [
                "nombre" => "Alajuela Centro",
                "descripcion" => "Llegada al centro de Alajuela."
            ]
        ]
    ],
    [
        "id" => 4,
        "origen" => "San José",
        "destino" => "Liberia",
        "empresa" => "Pulmitan",
        "tipo" => "Interurbano",
        "tarifa" => 4500,
        "frecuencia" => "Cada 2 horas",
        "estado" => "En revisión",
        "telefono" => "2222-0000",
        "email" => "info@pulmitan.com",
        "horarios" => [
            [
                "dia" => "Lunes a Viernes",
                "primerServicio" => "05:00 AM",
                "ultimoServicio" => "08:00 PM",
                "frecuencia" => "Cada 2 horas"
            ],
            [
                "dia" => "Sábados",
                "primerServicio" => "05:30 AM",
                "ultimoServicio" => "07:00 PM",
                "frecuencia" => "Cada 2-3 horas"
            ],
            [
                "dia" => "Domingos y Feriados",
                "primerServicio" => "06:00 AM",
                "ultimoServicio" => "06:00 PM",
                "frecuencia" => "Cada 3 horas"
            ]
        ],
        "paradas" => [
            [
                "nombre" => "Terminal San José",
                "descripcion" => "Salida desde la terminal principal de buses hacia Guanacaste."
            ],
            [
                "nombre" => "Cañas",
                "descripcion" => "Parada intermedia en la zona de Cañas, Guanacaste."
            ],
            [
                "nombre" => "Bagaces",
                "descripcion" => "Parada sobre la ruta hacia Liberia."
            ],
            [
                "nombre" => "Liberia Centro",
                "descripcion" => "Llegada al centro de Liberia, Guanacaste."
            ],
            [
                "nombre" => "Terminal Liberia",
                "descripcion" => "Terminal principal de llegada para la ruta San José - Liberia."
            ]
        ]
    ]
];

$id = isset($_GET["id"]) ? intval($_GET["id"]) : 1;

$rutaEncontrada = null;

foreach ($rutas as $ruta) {
    if ($ruta["id"] === $id) {
        $rutaEncontrada = $ruta;
        break;
    }
}

if ($rutaEncontrada) {
    echo json_encode($rutaEncontrada, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(404);
    echo json_encode(["mensaje" => "Ruta no encontrada"], JSON_UNESCAPED_UNICODE);
}
?>