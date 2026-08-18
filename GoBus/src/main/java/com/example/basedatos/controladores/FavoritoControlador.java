package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.basedatos.repositorios.FavoritoRepositorio;
import com.example.basedatos.tablas.Favorito;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/favoritos")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})

public class FavoritoControlador {

    @Autowired
    private FavoritoRepositorio repositorioFavorito;

    // Todos los favoritos (sin filtrar)
    @GetMapping
    public List<Favorito> consultarFavoritos(){
        return repositorioFavorito.findAll();
    }

    // Favoritos de un usuario especifico
    @GetMapping("/usuario/{idUsuario}")
    public List<Favorito> consultarFavoritosDeUsuario(@PathVariable Long idUsuario){
        return repositorioFavorito.findByUsuarioId(idUsuario);
    }

    // Crear favorito, evitando duplicados si el usuario ya marco esa ruta
    @PostMapping
    public ResponseEntity<Favorito> crearFavoritos(@RequestBody Favorito favorito){
        boolean yaExiste = repositorioFavorito.existsByUsuarioIdAndRutaId(
            favorito.getUsuario().getId(),
            favorito.getRuta().getId()
        );

        if (yaExiste) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Favorito guardado = repositorioFavorito.save(favorito);
        return ResponseEntity.ok(guardado);
    }

    // Quitar favorito por usuario + ruta 
    @DeleteMapping("/usuario/{idUsuario}/ruta/{idRuta}")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Long idUsuario, @PathVariable Long idRuta){
        Optional<Favorito> favorito = repositorioFavorito.findByUsuarioIdAndRutaId(idUsuario, idRuta);

        if (favorito.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        repositorioFavorito.delete(favorito.get());
        return ResponseEntity.ok().build();
    }
}