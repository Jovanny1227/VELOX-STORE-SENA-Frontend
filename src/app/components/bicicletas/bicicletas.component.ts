import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'; // <-- IMPORTANTE: FormsModule agregado
import { HttpClient } from '@angular/common/http';
import { BicicletaService } from '../../services/bicicleta.service';

@Component({
  selector: 'app-bicicletas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // <-- FormsModule añadido aquí
  templateUrl: './bicicletas.component.html',
  styleUrls: ['./bicicletas.component.css'],
})
export class BicicletasComponent implements OnInit {
  bicicletaForm: FormGroup;
  catalogo: any[] = [];
  catalogoFiltrado: any[] = []; // Para renderizar en la tabla
  proveedores: any[] = [];

  cargando: boolean = true;
  editando: boolean = false;
  idBicicletaActual: number | null = null;

  modoMasivo: boolean = false;
  listaEspera: any[] = [];
  mostrarDropdown: boolean = false;

  // 🔥 NUEVOS FILTROS AVANZADOS 🔥
  filtros = {
    termino: '',
    precioMin: null as number | null,
    precioMax: null as number | null,
  };

  constructor(
    private fb: FormBuilder,
    private bicicletaService: BicicletaService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    this.bicicletaForm = this.fb.group({
      codigo: [''],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      proveedorNombre: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarCatalogo();
  }

  cargarProveedores() {
    this.http.get<any[]>('http://localhost:8080/api/proveedores').subscribe((data) => {
      this.proveedores = data;
      this.cdr.detectChanges();
    });
  }

  cargarCatalogo() {
    this.cargando = true;
    this.bicicletaService.listarBicicletas().subscribe({
      next: (data) => {
        this.catalogo = data;
        this.catalogoFiltrado = [...this.catalogo]; // Inicializamos la tabla filtrada
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando bicicletas', err);
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ==========================================
  //      MOTOR DE FILTROS PARA LA TABLA
  // ==========================================
  filtrarBicicletas() {
    this.catalogoFiltrado = this.catalogo.filter((b) => {
      // 1. Filtro por Texto (Código, Marca o Modelo)
      const term = this.filtros.termino.toLowerCase();
      const coincideTexto = term
        ? (b.modelo && b.modelo.toLowerCase().includes(term)) ||
          (b.marca && b.marca.toLowerCase().includes(term)) ||
          (b.codigo && b.codigo.toLowerCase().includes(term))
        : true;

      // 2. Filtro por Rango de Precio
      const precioBici = b.precio || 0;
      const coincidePrecioMin =
        this.filtros.precioMin !== null && this.filtros.precioMin !== undefined
          ? precioBici >= this.filtros.precioMin
          : true;
      const coincidePrecioMax =
        this.filtros.precioMax !== null && this.filtros.precioMax !== undefined
          ? precioBici <= this.filtros.precioMax
          : true;

      return coincideTexto && coincidePrecioMin && coincidePrecioMax;
    });
    this.cdr.detectChanges();
  }

  limpiarFiltros() {
    this.filtros = { termino: '', precioMin: null, precioMax: null };
    this.filtrarBicicletas();
  }

  // ==========================================
  //      RESTO DE LÓGICA CRUD
  // ==========================================
  onSubmit() {
    if (this.bicicletaForm.invalid) {
      this.bicicletaForm.markAllAsTouched();
      return;
    }

    const formValue = this.bicicletaForm.value;

    // 🔥 Aseguramos la búsqueda ignorando mayúsculas y espacios extra 🔥
    const nombreBuscado = formValue.proveedorNombre.trim().toLowerCase();
    const provEncontrado = this.proveedores.find(
      (p) => p.nombre.trim().toLowerCase() === nombreBuscado,
    );

    if (!provEncontrado) {
      alert('⚠️ Por favor, selecciona un proveedor válido de la lista sugerida.');
      return;
    }

    const datos = {
      ...formValue,
      proveedorId: provEncontrado.idProveedor || provEncontrado.id,
      cantidad: formValue.stock,
    };
    delete datos.proveedorNombre;

    if (this.modoMasivo) {
      this.listaEspera.push(datos);
      this.bicicletaForm.reset();
      this.cdr.detectChanges();
      return;
    }

    if (this.editando && this.idBicicletaActual) {
      this.bicicletaService.actualizarBicicleta(this.idBicicletaActual, datos).subscribe({
        next: () => {
          this.resetearFormulario();
          this.cargarCatalogo();
        },
        error: (err) => {
          console.error('Error actualizando:', err);
          alert('Hubo un error al actualizar la bicicleta.');
        },
      });
    } else {
      this.bicicletaService.crearBicicleta(datos).subscribe({
        next: () => {
          this.resetearFormulario();
          this.cargarCatalogo();
        },
        error: (err) => {
          console.error('Error creando:', err);
          alert('Hubo un error al crear la bicicleta.');
        },
      });
    }
  }

  toggleModoMasivo() {
    this.modoMasivo = !this.modoMasivo;
    this.resetearFormulario();
    this.listaEspera = [];
    this.cdr.detectChanges();
  }

  quitarDeLista(index: number) {
    this.listaEspera.splice(index, 1);
    this.cdr.detectChanges();
  }

  enviarLoteMasivo() {
    if (this.listaEspera.length === 0) return;

    const requestMasivo = { items: this.listaEspera };

    this.cargando = true;
    this.bicicletaService.registrarMasivo(requestMasivo as any).subscribe({
      next: (respuestaBackend) => {
        alert('Lote registrado con éxito: ' + respuestaBackend);
        this.listaEspera = [];
        this.toggleModoMasivo();
        this.cargarCatalogo();
      },
      error: (err) => {
        console.error('Error en carga masiva', err);
        alert('Hubo un error al registrar el lote');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  editarBicicleta(bici: any) {
    this.editando = true;
    this.modoMasivo = false;
    this.idBicicletaActual = bici.id || bici.idBicicleta;

    // 🔥 ESTRATEGIA DEFINITIVA: "El Buscador Ciego" 🔥
    // No importa cómo Java llame a la variable (proveedor, provNombre, etc.)
    // Buscamos si ALGÚN valor dentro de esta bicicleta es igual al nombre de un proveedor.
    let nombreProveedor = '';

    for (const prov of this.proveedores) {
      // Sacamos todos los valores (Ej: [1, "BIC-001", "Marlin 7", "Trek", 500, "MTB", "GW Colombia"])
      const valoresBici = Object.values(bici);

      if (valoresBici.includes(prov.nombre)) {
        nombreProveedor = prov.nombre;
        break; // ¡Lo encontramos! Detenemos la búsqueda.
      }
    }

    // Llenamos el formulario
    this.bicicletaForm.patchValue({
      codigo: bici.codigo,
      marca: bici.marca,
      modelo: bici.modelo,
      tipo: bici.tipo,
      precio: bici.precio,
      proveedorNombre: nombreProveedor, // ¡Ahora sí se llenará solo!
      stock: bici.stock !== null && bici.stock !== undefined ? bici.stock : 0,
    });

    this.cdr.detectChanges(); // Forzamos a Angular a pintar el nombre de inmediato
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarBicicleta(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.bicicletaService.eliminar(id).subscribe(() => this.cargarCatalogo());
    }
  }

  resetearFormulario() {
    this.bicicletaForm.reset();
    this.editando = false;
    this.idBicicletaActual = null;
    this.cdr.detectChanges();
  }

  get proveedoresFiltrados() {
    const busqueda = this.bicicletaForm.get('proveedorNombre')?.value?.toLowerCase() || '';
    return this.proveedores.filter((p) => p.nombre.toLowerCase().includes(busqueda));
  }

  seleccionarProveedor(prov: any) {
    this.bicicletaForm.patchValue({ proveedorNombre: prov.nombre });
    this.mostrarDropdown = false;
    this.cdr.detectChanges();
  }
}
