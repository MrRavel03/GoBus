package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.basedatos.repositorios.BusquedaRepositorio;
import com.example.basedatos.tablas.Busqueda;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/historial")
@CrossOrigin(origins = "*")

public class BusquedaControlador{
    @Autowired
    private BusquedaRepositorio repositorioBusqueda;

    /** Historial de busquedas de un usuario especifico, mas reciente primero. */
    @GetMapping("/usuario/{idUsuario}")
    public List<Busqueda> consultarHistorial(@PathVariable Long idUsuario){
        return repositorioBusqueda.findByUsuarioIdOrderByFechaDesc(idUsuario);
    }

    @PostMapping
    public Busqueda registrarBusqueda(@RequestBody Busqueda busqueda){
        // La fecha la pone el servidor, no el cliente
        busqueda.setFecha(LocalDateTime.now());
        return repositorioBusqueda.save(busqueda);
    }

    //Metodo BORRAR (para limpiar una entrada del historial)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarBusqueda(@PathVariable Long id){
        if (!repositorioBusqueda.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        repositorioBusqueda.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
