package com.example.basedatos.repositorios;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
}

