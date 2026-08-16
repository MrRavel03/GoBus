package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.basedatos.repositorios.HorarioRepositorio;
import com.example.basedatos.tablas.Horario;


@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")


public class HorarioControlador{
    @Autowired
    private HorarioRepositorio repositorioHorario;

    //Crear y editar 
    @PostMapping
    public Horario guardarHorarios(@RequestBody Horario horario){
        return repositorioHorario.save(horario);
    }

    //Borrar
    @DeleteMapping("/{id}")
    public void eliminarHorario(@PathVariable Long id){
        repositorioHorario.deleteById(id);
    }

}
