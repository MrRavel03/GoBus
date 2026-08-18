package com.example.basedatos.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.basedatos.tablas.Ruta;

public interface RutaRepositorio extends JpaRepository<Ruta, Long> {

     /** Lista de origenes sin repetir, para llenar el select del buscador. */
    @Query("SELECT DISTINCT r.origen FROM Ruta r")
    List<String> obtenerOrigenes();

    /** Lista de destinos sin repetir, para llenar el select del buscador. */
    @Query("SELECT DISTINCT r.destino FROM Ruta r")
    List<String> obtenerDestinos();

    // Consultas derivadas: Spring Data las arma a partir del nombre del metodo.
    // "Containing" = LIKE %texto%, "IgnoreCase" = sin distinguir mayusculas.
    // Son mas confiables que un @Query con parametros comparados contra ''.

    List<Ruta> findByOrigenContainingIgnoreCaseAndDestinoContainingIgnoreCase(String origen, String destino);

    List<Ruta> findByOrigenContainingIgnoreCase(String origen);

    List<Ruta> findByDestinoContainingIgnoreCase(String destino);

                                       

}