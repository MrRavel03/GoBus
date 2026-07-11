package com.example.BaseDatos.Controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BaseDatos.Repositorios.ParadaRepositorio;
import com.example.BaseDatos.Tablas.Parada;
import java.util.List;

@RestController
@RequestMapping("/paradas")

public class ParadaControlador{
    @Autowired
    private ParadaRepositorio repositorioParada;

    @GetMapping
    public List <Parada> consultarParadas(){
        return repositorioParada.findAll();
    }

    @PostMapping
    public Parada crearParadas(@RequestBody Parada parada){
        return repositorioParada.save(parada);
    }

}


