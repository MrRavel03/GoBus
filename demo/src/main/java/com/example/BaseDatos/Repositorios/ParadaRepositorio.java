package com.example.BaseDatos.Repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.BaseDatos.Tablas.Parada;

public interface ParadaRepositorio extends JpaRepository<Parada, Long> {}