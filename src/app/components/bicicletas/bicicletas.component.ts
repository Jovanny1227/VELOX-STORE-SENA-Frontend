import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BicicletaService } from '../../services/bicicleta.service';
import { Bicicleta } from '../../models/bicicleta.model';

@Component({
  selector: 'app-bicicletas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bicicletas.component.html',
  styleUrls: ['./bicicletas.component.css']
})
export class BicicletasComponent implements OnInit {

  bicicletas: Bicicleta[] = [];
  stockInicial: number = 0;
  mensaje = '';
  mensajeError = '';

  nuevaBicicleta: Bicicleta = { marca: '', modelo: '', precio: 0, tipo: '' };

  imagenesMap: Record<string, string> = {
    MTB: 'assets/bikes/mtb.png',
    RUTA: 'assets/bikes/ruta.png',
    URBANO: 'assets/bikes/urbano.png',
    BMX: 'assets/bikes/bmx.png'
  };

  constructor(private bicicletaService: BicicletaService) {}

  ngOnInit(): void { this.cargarBicicletas(); }

  cargarBicicletas() {
    this.bicicletaService.listarBicicletas().subscribe({
      next: data => this.bicicletas = data,
      error: () => this.mensajeError = 'Error al cargar bicicletas'
    });
  }

  registrarBicicleta() {
    this.mensaje = '';
    this.mensajeError = '';
    if (!this.nuevaBicicleta.marca || !this.nuevaBicicleta.modelo || !this.nuevaBicicleta.tipo || this.nuevaBicicleta.precio <= 0) {
      this.mensajeError = 'Complete todos los campos';
      return;
    }
    this.bicicletaService.registrarBicicleta(this.nuevaBicicleta, this.stockInicial).subscribe({
      next: () => {
        this.mensaje = 'Bicicleta registrada correctamente';
        this.nuevaBicicleta = { marca: '', modelo: '', precio: 0, tipo: '' };
        this.stockInicial = 0;
        this.cargarBicicletas();
      },
      error: () => this.mensajeError = 'Error al registrar bicicleta'
    });
  }

  getImagen(tipo: string): string {
    return this.imagenesMap[tipo] || 'assets/bikes/mtb.png';
  }
}
