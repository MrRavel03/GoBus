package com.example.basedatos.tablas;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity

public class Tarifa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private BigDecimal costo;

    public long getId() {return id;}
    public void setId(long id) {this.id = id;}

    public BigDecimal getCosto() {return costo;}
    public void setCosto(BigDecimal costo) {this.costo = costo;}

    @ManyToOne
    @JoinColumn(name = "id_ruta", nullable = false)
    private Ruta ruta;
    public Ruta getRuta() {return ruta;}
    public void setRuta(Ruta ruta) {this.ruta = ruta;}

    

}
