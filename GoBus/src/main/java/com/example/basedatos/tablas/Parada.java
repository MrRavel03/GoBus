package com.example.basedatos.tablas;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)

public class Parada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String nombre;
    private String descripcion;
    private Double latitud;
    private Double longitud;

    @ManyToOne
    @JoinColumn(name = "id_ruta")
    @JsonIgnoreProperties("paradas") 
    private Ruta ruta;

    public Parada(){}
   
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getNombre() {return nombre;}
    public void setNombre(String nombre) {this.nombre = nombre;}

    public String getDescripcion() {return descripcion;}
    public void setDescripcion(String descripcion) {this.descripcion = descripcion;}

    public Double getLatitud() {return latitud;}
    public void setLatitud(Double latitud) {this.latitud = latitud;}

    public Double getLongitud() {return longitud;}
    public void setLongitud(Double longitud) {this.longitud = longitud;}

    public Ruta getRuta() {return ruta;}
    public void setRuta(Ruta ruta) {this.ruta = ruta;}

    

    

}
