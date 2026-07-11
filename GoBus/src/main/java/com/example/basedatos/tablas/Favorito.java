package com.example.basedatos.tablas;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity

public class Favorito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_ruta", nullable = false)

    private Ruta ruta;

    public long getId() {return id;}
    public void setId(long id) {this.id = id;}

    public Usuario getUsuario() {return usuario;}
    public void setUsuario(Usuario usuario) {this.usuario = usuario;}

    public Ruta getRuta() {return ruta;}
    public void setRuta(Ruta ruta) {this.ruta = ruta;}

    

}
