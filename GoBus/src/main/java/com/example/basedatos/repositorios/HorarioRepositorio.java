package com.example.basedatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Horario;

public interface HorarioRepositorio extends JpaRepository<Horario, Long> {}