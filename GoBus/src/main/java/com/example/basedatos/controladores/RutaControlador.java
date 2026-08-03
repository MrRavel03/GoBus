package com.example.basedatos.controladores;

import com.example.basedatos.tablas.Ruta;
import com.example.basedatos.repositorios.RutaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rutas")
@CrossOrigin(origins="*")


public class RutaControlador {

    @Autowired
    private RutaRepositorio rutaRepositorio;

    // Reemplaza a rutas.php
    //Obtener todas las rutas
    @GetMapping
    public List<Ruta> obtenerRutas() {
        return (List<Ruta>) rutaRepositorio.findAll();
    }

    // Reemplaza a detalle-ruta.php?id=X
    //Obtener solo una ruta por ID
    @GetMapping("/{id}")
    public ResponseEntity<Ruta> obtenerDetalleRuta(@PathVariable Long id) {
        Optional<Ruta> ruta = rutaRepositorio.findById(id);
        
        return ruta.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    //Si el objecto ruta trae un ID se actualiza el existente
    //Si el ID viene vacio, crea uno nuevo

    //Metodo CREAR Y EDITAR
    @PostMapping 
    public Ruta guardarRuta(@RequestBody Ruta ruta){
        return rutaRepositorio.save(ruta);
    }

    //Metodo BORRAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRuta (@PathVariable Long id){
        if (!rutaRepositorio.existsById(id)){
            return ResponseEntity.notFound().build();

        }
        rutaRepositorio.deleteById(id);
        return ResponseEntity.ok().build();
    }





}