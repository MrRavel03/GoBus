package com.example.basedatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Ruta;

public interface RutaRepositorio extends JpaRepository<Ruta, Long> {}