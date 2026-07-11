package com.example.basedatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Tarifa;

public interface TarifaRepositorio extends JpaRepository<Tarifa, Long> {}