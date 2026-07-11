package com.example.basedatos.tablas;

import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity

public class Horario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private LocalTime horaSalida;
    private LocalTime horaLlegada;
    private String frecuencia;

    public long getId() {return id;}
    public void setId(long id) {this.id = id;}

    public LocalTime getHoraSalida() {return horaSalida;}
    public void setHoraSalida(LocalTime horaSalida) {this.horaSalida = horaSalida;}

    public LocalTime getHoraLlegada() {return horaLlegada;}
    public void setHoraLlegada(LocalTime horaLlegada) {this.horaLlegada = horaLlegada;}

    public String getFrecuencia() {return frecuencia;}
    public void setFrecuencia(String frecuencia) {this.frecuencia = frecuencia;}

    @ManyToOne
    @JoinColumn(name = "id_ruta", nullable = false)
    private Ruta ruta;
    public Ruta getRuta() {return ruta;}
    public void setRuta(Ruta ruta) {this.ruta = ruta;}

    


    
}
