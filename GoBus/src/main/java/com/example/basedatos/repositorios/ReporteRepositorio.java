package com.example.basedatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Reporte;

public interface ReporteRepositorio extends JpaRepository<Reporte, Long> {}