package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*")

public class UsuarioControlador {
    @Autowired
    private UsuarioRepositorio repositorioUsuario;

    @GetMapping
    public List <Usuario> consultarUsuarios(){
        return repositorioUsuario.findAll();
    }

    @PostMapping
    public Usuario crearUsuarios(@RequestBody Usuario usuario){
        if (usuario.getRol()==null||usuario.getRol().isEmpty()){
            usuario.setRol("USER");
        }
        return repositorioUsuario.save(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody Usuario loginDatos){
        return repositorioUsuario.findByCorreo(loginDatos.getCorreo()).
        filter(user -> user.getUserPassword().equals(loginDatos.getUserPassword()))
        .map(user -> ResponseEntity.ok(user))
        .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

}
