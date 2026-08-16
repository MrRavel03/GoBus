package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.basedatos.repositorios.ParadaRepositorio;
import com.example.basedatos.tablas.Parada;
import java.util.List;

@RestController
@RequestMapping("/api/paradas")
@CrossOrigin(origins = "*")

public class ParadaControlador{

    @Autowired
    private ParadaRepositorio repositorioParada;

    //Obtener todas las paradas
    @GetMapping
    public List <Parada> consultarParadas(){
        return repositorioParada.findAll();
    }

    //Guardar o editar parada
    @PostMapping
    public Parada crearParadas(@RequestBody Parada parada){
        return repositorioParada.save(parada);
    }

    //Borrar una parada
    @DeleteMapping("/{id}")
     public void eliminarParada(@PathVariable Long id) {
        repositorioParada.deleteById(id);
     }

}


