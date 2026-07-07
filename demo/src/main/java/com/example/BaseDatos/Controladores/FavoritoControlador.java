package com.example.BaseDatos.Controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BaseDatos.Repositorios.FavoritoRepositorio;
import com.example.BaseDatos.Tablas.Favorito;
import java.util.List;

@RestController
@RequestMapping("/favoritos")

public class FavoritoControlador{
    @Autowired
    private FavoritoRepositorio repositorioFavorito;

    @GetMapping
    public List <Favorito> consultarFavoritos(){
        return repositorioFavorito.findAll();
    }

    @PostMapping
    public Favorito crearFavoritos(@RequestBody Favorito favorito){
        return repositorioFavorito.save(favorito);
    }

}
