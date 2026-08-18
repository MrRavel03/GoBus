package com.example.basedatos.tablas;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)

public class Favorito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties("favoritos")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_ruta", nullable = false)
    @JsonIgnoreProperties("favoritos")

    private Ruta ruta;

    public Favorito(){}

    public long getId() {return id;}
    public void setId(long id) {this.id = id;}

    public Usuario getUsuario() {return usuario;}
    public void setUsuario(Usuario usuario) {this.usuario = usuario;}

    public Ruta getRuta() {return ruta;}
    public void setRuta(Ruta ruta) {this.ruta = ruta;}

    

}
