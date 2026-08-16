package com.example.basedatos.tablas;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
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

    @Column(name = "dia")
    private String dia;

    @Column(name = "primerServicio") 
    private String primerServicio;

    @Column(name = "ultimoServicio")
    private String ultimoServicio;

    private String frecuencia;

    @ManyToOne
    @JoinColumn(name = "id_ruta")
    @JsonIgnoreProperties({"horarios", "tarifas", "paradas", "favoritos"})
    private Ruta ruta;

    public Horario(){}

    public Ruta getRuta() {return ruta;}
    public void setRuta(Ruta ruta) {this.ruta = ruta;}

    public long getId() {return id;}
    public void setId(long id) {this.id = id;}

    public String getPrimerServicio() {return primerServicio;}
    public void setPrimerServicio(String primerServicio) {this.primerServicio = primerServicio;}

    public String getUltimoServicio() {return ultimoServicio;}
    public void setUltimoServicio(String ultimoServicio) {this.ultimoServicio = ultimoServicio;}

    public String getFrecuencia() {return frecuencia;}
    public void setFrecuencia(String frecuencia) {this.frecuencia = frecuencia;}

    public String getDia() { return dia; }
    public void setDia(String dia) { this.dia = dia; }


    

}
