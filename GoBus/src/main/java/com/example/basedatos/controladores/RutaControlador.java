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
public class RutaControlador {

    @Autowired
    private RutaRepositorio rutaRepositorio;

    // Reemplaza a rutas.php
    @GetMapping
    public List<Ruta> obtenerRutas() {
        return (List<Ruta>) rutaRepositorio.findAll();
    }

    // Reemplaza a detalle-ruta.php?id=X
    @GetMapping("/{id}")
    public ResponseEntity<Ruta> obtenerDetalleRuta(@PathVariable Integer id) {
        Optional<Ruta> ruta = rutaRepositorio.findById(id);
        
        return ruta.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }
}