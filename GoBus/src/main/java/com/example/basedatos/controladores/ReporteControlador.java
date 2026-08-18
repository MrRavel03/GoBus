package com.example.basedatos.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.basedatos.repositorios.ReporteRepositorio;
import com.example.basedatos.tablas.Reporte;
import java.util.List;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")

public class ReporteControlador{
    @Autowired
    private ReporteRepositorio repositorioReporte;

    //Para que el usuario envie un reporte
    @PostMapping
    public Reporte guardarReporte(@RequestBody Reporte reporte) {
         return repositorioReporte.save(reporte);
    }

    @GetMapping
    public List <Reporte> consultarReportes(){
        return repositorioReporte.findAll();
    }

    @PutMapping("/{id}/revisado")
    public ResponseEntity<Reporte> marcarComoRevisado(@PathVariable Long id) {
            return repositorioReporte.findById(id).map(reporte -> {
                reporte.setEstado("Revisado");
                return ResponseEntity.ok(repositorioReporte.save(reporte));
            })
            .orElse(ResponseEntity.notFound().build());
        }


}






