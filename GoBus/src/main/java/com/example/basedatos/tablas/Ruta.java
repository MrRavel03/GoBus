package com.example.basedatos.tablas;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;


@Entity


public class Ruta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String origen;
    private String destino;
    private String empresa;

    public long getId() {return id;}
    public void setId(long id) {this.id = id;}

    public String getOrigen() {return origen;}
    public void setOrigen(String origen) {this.origen = origen;}

    public String getDestino() {return destino;}
    public void setDestino(String destino) {this.destino = destino;}

    public String getEmpresa() {return empresa;}
    public void setEmpresa(String empresa) {this.empresa = empresa;}

    @OneToMany(mappedBy = "ruta")
    private List<Horario> horarios;

    @OneToMany(mappedBy = "ruta")
    private List<Tarifa> tarifas;

    @OneToMany(mappedBy = "ruta")
    private List<Parada> paradas;

    @OneToMany(mappedBy = "ruta")
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
