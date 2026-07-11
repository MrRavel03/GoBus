package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.basedatos.repositorios.TarifaRepositorio;
import com.example.basedatos.tablas.Tarifa;
import java.util.List;

@RestController
@RequestMapping("/tarifas")

public class TarifaControlador{
    @Autowired
    private TarifaRepositorio repositorioTarifa;

    @GetMapping
    public List <Tarifa> consultarTarifas(){
        return repositorioTarifa.findAll();
    }

    @PostMapping
    public Tarifa crearTarifas(@RequestBody Tarifa tarifa){
        return repositorioTarifa.save(tarifa);
    }

}






