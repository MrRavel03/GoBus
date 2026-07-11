package com.example.BaseDatos.Repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.BaseDatos.Tablas.Favorito;

public interface FavoritoRepositorio extends JpaRepository<Favorito, Long> {}