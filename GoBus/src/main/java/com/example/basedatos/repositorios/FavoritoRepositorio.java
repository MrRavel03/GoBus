package com.example.basedatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Favorito;
import java.util.List;
import java.util.Optional;

public interface FavoritoRepositorio extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioId(Long idUsuario);

    Optional<Favorito> findByUsuarioIdAndRutaId(Long idUsuario, Long idRuta);

    boolean existsByUsuarioIdAndRutaId(Long idUsuario, Long idRuta);
}