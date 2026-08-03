package com.example.basedatos.tablas;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity


public class Ruta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String origen;
    private String destino;
    private String empresa;
    private String tipo;
    private Double tarifa;
    private String frecuencia;
    private String estado;

    public long getId() {return id;}
    public void setId(long id) {this.id = id;}

    public String getOrigen() {return origen;}
    public void setOrigen(String origen) {this.origen = origen;}

    public String getDestino() {return destino;}
    public void setDestino(String destino) {this.destino = destino;}

    public String getEmpresa() {return empresa;}
    public void setEmpresa(String empresa) {this.empresa = empresa;}


    public String getTipo() {return tipo;}
    public void setTipo(String tipo) {this.tipo = tipo;}

    public Double getTarifa() {return tarifa;}
    public void setTarifa(Double tarifa) {this.tarifa = tarifa;}

    public String getFrecuencia() {return frecuencia;}
    public void setFrecuencia(String frecuencia) {this.frecuencia = frecuencia;}

    public String getEstado() {return estado;}
    public void setEstado(String estado) {this.estado = estado;}

    @OneToMany(mappedBy = "ruta")
    @JsonIgnore
    private List<Horario> horarios;

    @OneToMany(mappedBy = "ruta")
    @JsonIgnore
    private List<Tarifa> tarifas;

    @OneToMany(mappedBy = "ruta")
    @JsonIgnore
    private List<Parada> paradas;

    @OneToMany(mappedBy = "ruta")
    @JsonIgnore
    private List<Favorito> favoritos;

    public List<Horario> getHorarios() {return horarios;}
    public void setHorarios(List<Horario> horarios) {this.horarios = horarios;}

    public List<Tarifa> getTarifas() {return tarifas;}
    public void setTarifas(List<Tarifa> tarifas) {this.tarifas = tarifas;}

    public List<Parada> getParadas() {return paradas;}
    public void setParadas(List<Parada> paradas) {this.paradas = paradas;}

    public List<Favorito> getFavoritos() {return favoritos;}
    public void setFavoritos(List<Favorito> favoritos) {this.favoritos = favoritos;}

    

}
