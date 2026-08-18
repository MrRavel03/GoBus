package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.basedatos.repositorios.FavoritoRepositorio;
import com.example.basedatos.tablas.Favorito;
import java.util.List;

@RestController
@RequestMapping("/favoritos")
@CrossOrigin(origins = "*")

public class FavoritoControlador{
    @Autowired
    private FavoritoRepositorio repositorioFavorito;

    @GetMapping
    public List <Favorito> consultarFavoritos(){
        return repositorioFavorito.findAll();
    }

    /** Favoritos de un usuario especifico, para pintarlos en su perfil. */
    @GetMapping("/usuario/{idUsuario}")
    public List<Favorito> consultarFavoritosDeUsuario(@PathVariable Long idUsuario){
        return repositorioFavorito.findByUsuarioId(idUsuario);
    }

    @PostMapping
    public ResponseEntity<Favorito> crearFavoritos(@RequestBody Favorito favorito){
        // Evita guardar la misma ruta como favorita dos veces para el mismo usuario
        boolean yaExiste = repositorioFavorito.existsByUsuarioIdAndRutaId(
                favorito.getUsuario().getId(), favorito.getRuta().getId());

        if (yaExiste){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok(repositorioFavorito.save(favorito));
    }

    //Metodo BORRAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFavorito(@PathVariable Long id){
        if (!repositorioFavorito.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        repositorioFavorito.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
