package com.example.basedatos.tablas;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo;
    private String rutaNombre;
    private String estado;

    //Fecha actual
    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha;

    public Reporte(){}

    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    public String getTipo() {return tipo;}
    public void setTipo(String tipo) {this.tipo = tipo;}

    public String getRutaNombre() {return rutaNombre;}
    public void setRutaNombre(String rutaNombre) {this.rutaNombre = rutaNombre;}

    public String getEstado() {return estado;}
    public void setEstado(String estado) {this.estado = estado;}

    public Date getFecha() {return fecha;}
    public void setFecha(Date fecha) {this.fecha = fecha;}



}
