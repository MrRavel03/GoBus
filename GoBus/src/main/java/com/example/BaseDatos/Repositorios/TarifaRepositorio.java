package com.example.BaseDatos.Repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.BaseDatos.Tablas.Tarifa;

public interface TarifaRepositorio extends JpaRepository<Tarifa, Long> {}