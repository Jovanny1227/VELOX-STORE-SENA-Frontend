import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- IMPORTAMOS ChangeDetectorRef
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
    private http: HttpClient,
    private cdr: ChangeDetectorRef, // <--- LO INYECTAMOS AQUÍ
  ) {
    // FORMULARIO LIMPIO SIN CONTACTO
    this.proveedorForm = this.fb.group({
      nit: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''], // Si en Java se llama "sede", cambia esta palabra a "sede"
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
        this.cdr.detectChanges(); // 🔥 PELLIZCO 1: Muestra la tabla de proveedores al instante
      },
      error: (err) => {
        console.error('Error cargando proveedores', err);
        this.cargando = false;
        this.cdr.detectChanges(); // Apaga el "cargando" si hay error
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
          this.cargarProveedores(); // Esto ya trae su propio detectChanges adentro
        },
        error: (err) => {
          alert('Error al actualizar el proveedor');
          this.cdr.detectChanges(); // Actualiza por si el alert traba la vista
        },
      });
    } else {
      this.http.post(this.apiUrl, datos).subscribe({
        next: () => {
          this.resetearFormulario();
          this.cargarProveedores();
        },
        error: (err) => {
          alert('Error al guardar el proveedor');
          this.cdr.detectChanges();
        },
      });
    }
  }

  editarProveedor(prov: any) {
    this.editando = true;
    this.idActual = prov.idProveedor || prov.id;

    // LLENAMOS EL FORMULARIO
    this.proveedorForm.patchValue({
      nit: prov.nit,
      nombre: prov.nombre,
      telefono: prov.telefono,
      email: prov.email,
      direccion: prov.direccion, // Igual aquí, si en Java es "sede", pon prov.sede
    });

    this.cdr.detectChanges(); // 🔥 PELLIZCO 2: Llena los inputs visualmente de inmediato

    // Scroll suave hacia arriba para que el admin vea el formulario listo para editar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarProveedor(id: number) {
    if (
      confirm(
        '⚠️ ¿Estás seguro de eliminar este proveedor? Podría causar errores si hay bicicletas vinculadas a él.',
      )
    ) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.cargarProveedores(),
        error: (err) => {
          alert(
            'No se puede eliminar. Es probable que tenga bicicletas asociadas en el inventario.',
          );
          this.cdr.detectChanges(); // Actualiza rápido después del error
        },
      });
    }
  }

  resetearFormulario() {
    this.proveedorForm.reset();
    this.editando = false;
    this.idActual = null;
    this.cdr.detectChanges(); // 🔥 PELLIZCO 3: Limpia el formulario a la velocidad de la luz
  }
}
