import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clienteForm: FormGroup;
  clientes: any[] = [];
  editando: boolean = false;
  idActual: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef, // <-- Inyectado aquí
  ) {
    this.clienteForm = this.fb.group({
      documento: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(20)]],
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges(); // <-- Forzamos la actualización de la vista
      },
      error: (err) => console.error('Error al cargar clientes', err),
    });
  }

  onSubmit() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }
    const datos = this.clienteForm.value;

    if (this.editando && this.idActual) {
      this.clienteService.actualizar(this.idActual, datos).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarClientes();
          alert('Cliente actualizado');
        },
        error: (err) => alert(err.error?.message || 'Error al actualizar'),
      });
    } else {
      this.clienteService.registrar(datos).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarClientes();
          alert('Cliente registrado con éxito');
        },
        error: (err) => alert(err.error?.message || 'Error al registrar'),
      });
    }
  }

  editarCliente(cliente: any) {
    this.editando = true;
    this.idActual = cliente.clienteId;
    this.clienteForm.patchValue({
      documento: cliente.documento,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
    });
    this.cdr.detectChanges(); // <-- Actualizamos vista al editar
  }

  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.clienteService.eliminar(id).subscribe({
        next: () => this.cargarClientes(),
        error: (err) => alert('Error al eliminar cliente'),
      });
    }
  }

  resetFormulario() {
    this.clienteForm.reset();
    this.editando = false;
    this.idActual = null;
    this.cdr.detectChanges(); // <-- Actualizamos vista al limpiar formulario
  }
}
