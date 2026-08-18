package com.example.basedatos.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Busqueda;

public interface BusquedaRepositorio extends JpaRepository<Busqueda, Long> {

    /** Historial de busquedas de un usuario, la mas reciente primero. */
    List<Busqueda> findByUsuarioIdOrderByFechaDesc(Long idUsuario);

}
