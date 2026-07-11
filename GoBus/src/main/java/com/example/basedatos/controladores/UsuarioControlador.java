package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.basedatos.repositorios.UsuarioRepositorio;
import com.example.basedatos.tablas.Usuario;
import java.util.List;



@RestController
@RequestMapping("/usuarios")

public class UsuarioControlador {
    @Autowired
    private UsuarioRepositorio repositorioUsuario;

    @GetMapping
    public List <Usuario> consultarUsuarios(){
        return repositorioUsuario.findAll();
    }

    @PostMapping
    public Usuario crearUsuarios(@RequestBody Usuario usuario){
        return repositorioUsuario.save(usuario);
    }

}
