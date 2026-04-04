import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent implements OnInit {
  proveedorForm: FormGroup;
  proveedores: any[] = [];

  cargando: boolean = true;
  editando: boolean = false;
  idActual: number | null = null;

  private apiUrl = 'http://localhost:8080/api/proveedores';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.proveedorForm = this.fb.group({
      nit: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.cargando = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.proveedores = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando proveedores', err);
        this.cargando = false;
      },
    });
  }

  onSubmit() {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    const datos = this.proveedorForm.value;

    if (this.editando && this.idActual) {
      this.http.put(`${this.apiUrl}/${this.idActual}`, datos).subscribe({
        next: () => {
          this.resetearFormulario();
          this.cargarProveedores();
        },
        error: (err) => alert('Error al actualizar el proveedor'),
      });
    } else {
      this.http.post(this.apiUrl, datos).subscribe({
        next: () => {
          this.resetearFormulario();
          this.cargarProveedores();
        },
        error: (err) => alert('Error al guardar el proveedor'),
      });
    }
  }

  editarProveedor(prov: any) {
    this.editando = true;
    this.idActual = prov.idProveedor || prov.id;

    this.proveedorForm.patchValue({
      nit: prov.nit,
      nombre: prov.nombre,
      telefono: prov.telefono,
      email: prov.email,
      direccion: prov.direccion,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarProveedor(id: number) {
    if (confirm('⚠️ ¿Estás seguro de eliminar este proveedor? Podría causar errores si hay bicicletas vinculadas a él.')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.cargarProveedores(),
        error: (err) => alert('No se puede eliminar. Es probable que tenga bicicletas asociadas en el inventario.'),
      });
    }
  }

  resetearFormulario() {
    this.proveedorForm.reset();
    this.editando = false;
    this.idActual = null;
  }
}
