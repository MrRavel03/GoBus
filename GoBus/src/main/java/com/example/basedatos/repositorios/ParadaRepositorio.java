package com.example.basedatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Parada;

public interface ParadaRepositorio extends JpaRepository<Parada, Long> {}