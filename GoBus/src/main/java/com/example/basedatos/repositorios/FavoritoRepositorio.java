package com.example.basedatos.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.basedatos.tablas.Favorito;

public interface FavoritoRepositorio extends JpaRepository<Favorito, Long> {}