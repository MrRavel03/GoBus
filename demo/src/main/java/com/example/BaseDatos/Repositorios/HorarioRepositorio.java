package com.example.BaseDatos.Repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.BaseDatos.Tablas.Horario;

public interface HorarioRepositorio extends JpaRepository<Horario, Long> {}