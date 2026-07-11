package com.example.BaseDatos.Controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BaseDatos.Repositorios.RutaRepositorio;
import com.example.BaseDatos.Tablas.Ruta;

import java.util.List;


@RestController
@RequestMapping("/rutas")

public class RutaControlador {
    @Autowired
    private RutaRepositorio repositorioRuta;

    @GetMapping
    public List <Ruta> consultarRutas(){
        return repositorioRuta.findAll();
    }

    @PostMapping
    public Ruta crearRutas(@RequestBody Ruta ruta){
        return repositorioRuta.save(ruta);
    }

}
