import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BicicletaService } from '../../services/bicicleta.service';
import { Bicicleta } from '../../models/bicicleta.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bicicletas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bicicletas.component.html',
  styleUrls: ['./bicicletas.component.css'],
})
export class BicicletasComponent implements OnInit {
  bicicletas: Bicicleta[] = [];

  nuevaBicicleta: Bicicleta = {
    modelo: '',
    marca: '',
    precio: 0,
    tipo: '',
  };

  stockInicial: number = 0;
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;
  bicicletaBuscada: Bicicleta | null = null;
  codigoBusqueda: string = '';

  constructor(private bicicletaService: BicicletaService) {}

  ngOnInit(): void {
    this.cargarBicicletas();
  }

  cargarBicicletas(): void {
    this.cargando = true;
    this.bicicletaService.listarBicicletas().subscribe({
      next: (data) => {
        this.bicicletas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.mensajeError = 'Error al cargar: ' + err.message;
        this.cargando = false;
      },
    });
  }

  registrarBicicleta(): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (
      !this.nuevaBicicleta.marca.trim() ||
      !this.nuevaBicicleta.modelo.trim() ||
      !this.nuevaBicicleta.tipo ||
      this.nuevaBicicleta.precio <= 0
    ) {
      this.mensajeError = '⚠️ Complete todos los campos correctamente';
      return;
    }

    if (this.stockInicial < 0) {
      this.mensajeError = '⚠️ El stock no puede ser negativo';
      return;
    }

    this.bicicletaService.registrarBicicleta(this.nuevaBicicleta, this.stockInicial).subscribe({
      next: (creada) => {
        this.mensajeExito = `✅ Bicicleta '${creada.codigo}' registrada (id=${creada.idBicicleta}).`;
        this.cargarBicicletas();
        this.limpiarFormulario();
      },
      error: (err) => {
        this.mensajeError = '❌ ' + (err.error || err.message);
      },
    });
  }

  buscarBicicleta(): void {
    if (!this.codigoBusqueda.trim()) return;

    this.bicicletaBuscada = null;
    this.mensajeError = '';

    this.bicicletaService.buscarPorCodigo(this.codigoBusqueda).subscribe({
      next: (b) => {
        this.bicicletaBuscada = b;
      },
      error: () => {
        this.mensajeError = `❌ No existe código '${this.codigoBusqueda}'.`;
      },
    });
  }

  limpiarFormulario(): void {
    this.nuevaBicicleta = { modelo: '', marca: '', precio: 0, tipo: '' };
    this.stockInicial = 0;
  }
}
