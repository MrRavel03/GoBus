package com.example.basedatos.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Favorito;

public interface FavoritoRepositorio extends JpaRepository<Favorito, Long> {

    /** Favoritos guardados por un usuario especifico. */
    List<Favorito> findByUsuarioId(Long idUsuario);

    /** Para evitar guardar la misma ruta como favorita dos veces. */
    boolean existsByUsuarioIdAndRutaId(Long idUsuario, Long idRuta);

}