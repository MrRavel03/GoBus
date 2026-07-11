package com.example.BaseDatos.Repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.BaseDatos.Tablas.Ruta;

public interface RutaRepositorio extends JpaRepository<Ruta, Long> {}