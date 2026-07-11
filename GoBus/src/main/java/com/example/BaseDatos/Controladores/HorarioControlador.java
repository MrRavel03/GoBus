package com.example.BaseDatos.Controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BaseDatos.Repositorios.HorarioRepositorio;
import com.example.BaseDatos.Tablas.Horario;
import java.util.List;


@RestController
@RequestMapping("/horarios")

public class HorarioControlador{
    @Autowired
    private HorarioRepositorio repositorioHorario;

    @GetMapping
    public List <Horario> listarRutas(){
        return repositorioHorario.findAll();
    }

    @PostMapping
    public Horario crearHorarios(@RequestBody Horario horario){
        return repositorioHorario.save(horario);
    }

}
