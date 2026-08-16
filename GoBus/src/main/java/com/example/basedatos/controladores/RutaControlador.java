package com.example.basedatos.controladores;

import com.example.basedatos.tablas.Ruta;
import com.example.basedatos.repositorios.RutaRepositorio;

import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rutas")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})

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

    //Metodo CREAR
    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public Ruta guardarRuta(@RequestBody Ruta ruta){
        return rutaRepositorio.save(ruta);
    }

    // METODO EDITAR
    @PutMapping("/{id}")
    public ResponseEntity<Ruta> actualizarRuta(@PathVariable Long id, @RequestBody Ruta rutaDetalles) {
        return rutaRepositorio.findById(id).map(rutaExistente -> {
            rutaExistente.setOrigen(rutaDetalles.getOrigen());
            rutaExistente.setDestino(rutaDetalles.getDestino());
            rutaExistente.setEmpresa(rutaDetalles.getEmpresa());
            rutaExistente.setTipo(rutaDetalles.getTipo());
            rutaExistente.setEstado(rutaDetalles.getEstado());
            rutaExistente.setFrecuencia(rutaDetalles.getFrecuencia());
            rutaExistente.setTarifa(rutaDetalles.getTarifa());
            rutaExistente.setTelefono(rutaDetalles.getTelefono());
            rutaExistente.setEmail(rutaDetalles.getEmail());
            Ruta rutaActualizada = rutaRepositorio.save(rutaExistente);
            return ResponseEntity.ok(rutaActualizada);
        }).orElseGet(() -> ResponseEntity.notFound().build());
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