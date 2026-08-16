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

    /** Origenes disponibles, para llenar el select del buscador de index.html. */
    @GetMapping("/origenes")
    public List<String> obtenerOrigenes() {
        return rutaRepositorio.obtenerOrigenes();
    }

    /** Destinos disponibles, para llenar el select del buscador de index.html. */
    @GetMapping("/destinos")
    public List<String> obtenerDestinos() {
        return rutaRepositorio.obtenerDestinos();
    }


    /*  Reemplaza a rutas.php
    //Obtener todas las rutas
    @GetMapping
    public List<Ruta> obtenerRutas() {
        return (List<Ruta>) rutaRepositorio.findAll();
    }*/

    /**
     * Obtener rutas. Si vienen origen y/o destino como parametros, filtra;
     * si no viene ninguno, devuelve todas.
     *
     * Ejemplos:
     *   /api/rutas
     *   /api/rutas?origen=San Jose
     *   /api/rutas?origen=San Jose&destino=Cartago
     */
    @GetMapping
    public List<Ruta> obtenerRutas(
            @RequestParam(required = false, defaultValue = "") String origen,
            @RequestParam(required = false, defaultValue = "") String destino) {
 
        String textoOrigen = origen.trim();
        String textoDestino = destino.trim();
 
        // Log temporal para ver en la terminal que esta llegando de verdad
        System.out.println("[GoBus] Buscando -> origen='" + textoOrigen
                + "' destino='" + textoDestino + "'");
 
        List<Ruta> rutas;
 
        if (textoOrigen.isEmpty() && textoDestino.isEmpty()) {
            rutas = rutaRepositorio.findAll();
 
        } else if (!textoOrigen.isEmpty() && !textoDestino.isEmpty()) {
            rutas = rutaRepositorio
                    .findByOrigenContainingIgnoreCaseAndDestinoContainingIgnoreCase(textoOrigen, textoDestino);
 
        } else if (!textoOrigen.isEmpty()) {
            rutas = rutaRepositorio.findByOrigenContainingIgnoreCase(textoOrigen);
 
        } else {
            rutas = rutaRepositorio.findByDestinoContainingIgnoreCase(textoDestino);
        }
 
        System.out.println("[GoBus] Rutas encontradas: " + rutas.size());
 
        return rutas;
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