package com.example.basedatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {}