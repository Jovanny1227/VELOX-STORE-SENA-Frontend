import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BicicletaService } from '../../services/bicicleta.service';
import { VentaService } from '../../services/venta.service';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  datosReporte: any[] = [];
  cargando: boolean = true;

  valorTotalInventario: number = 0;
  unidadesTotales: number = 0;
  listaBajoStock: any[] = [];

  chartCategorias: any;
  chartMarcas: any;

  constructor(
    private router: Router,
    private bicicletaService: BicicletaService,
    private ventaService: VentaService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    const navegacion = this.router.getCurrentNavigation();
    if (navegacion?.extras.state && navegacion.extras.state['datosFiltrados']) {
      this.datosReporte = navegacion.extras.state['datosFiltrados'];
    }
  }

  ngOnInit(): void {
    this.cargarHistorialVentas();
    this.cargarMovimientos();

    if (this.datosReporte.length > 0) {
      this.procesarDatos(this.datosReporte);
      this.cargando = false;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.generarGraficos();
        this.cdr.detectChanges();
      }, 100);

    } else {
      this.bicicletaService.listarBicicletas().subscribe({
        next: (data) => {
          this.procesarDatos(data);
          this.cargando = false;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.generarGraficos();
            this.cdr.detectChanges();
          }, 100);
        },
        error: (err) => {
          console.error('Error cargando datos para reportes', err);
          this.cargando = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  procesarDatos(datos: any[]) {
    this.datosReporte = datos;
    this.valorTotalInventario = 0;
    this.unidadesTotales = 0;
    this.listaBajoStock = [];

    datos.forEach((item) => {
      const stockReal = item.stock !== null ? item.stock : 0;
      this.unidadesTotales += stockReal;
      this.valorTotalInventario += stockReal * item.precio;
      if (stockReal <= 3) {
        this.listaBajoStock.push(item);
      }
    });
  }

  generarGraficos() {
    if (this.chartCategorias) this.chartCategorias.destroy();
    if (this.chartMarcas) this.chartMarcas.destroy();

    const conteoCategorias: any = {};
    const conteoMarcas: any = {};

    this.datosReporte.forEach((item) => {
      const stock = item.stock !== null ? item.stock : 0;
      conteoCategorias[item.tipo] = (conteoCategorias[item.tipo] || 0) + stock;
      conteoMarcas[item.marca] = (conteoMarcas[item.marca] || 0) + stock;
    });

    const paletaDona = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    const colorTexto = '#475569';

    const ctxCategorias = document.getElementById('canvasCategorias') as HTMLCanvasElement;
    if (ctxCategorias) {
      this.chartCategorias = new Chart(ctxCategorias, {
        type: 'doughnut',
        data: { labels: Object.keys(conteoCategorias), datasets: [{ data: Object.values(conteoCategorias), backgroundColor: paletaDona, borderWidth: 2, borderColor: '#ffffff' }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right' } } },
      });
    }

    const ctxMarcas = document.getElementById('canvasMarcas') as HTMLCanvasElement;
    if (ctxMarcas) {
      this.chartMarcas = new Chart(ctxMarcas, {
        type: 'bar',
        data: { labels: Object.keys(conteoMarcas), datasets: [{ label: 'Unidades', data: Object.values(conteoMarcas), backgroundColor: '#ea580c', borderRadius: 3 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } },
      });
    }
  }

  volverAlInventario() { this.router.navigate(['/admin/inventario']); }

  exportarExcel() {
    const datosParaExportar = this.datosReporte.map((item) => ({
      'Código SKU': item.codigo, Marca: item.marca, Modelo: item.modelo, Categoría: item.tipo,
      'Precio Venta': item.precio, 'Stock Actual': item.stock !== null ? item.stock : 0,
      Estado: item.stock !== null && item.stock <= 3 ? 'CRÍTICO' : 'NORMAL',
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario Actual Velox');
    XLSX.writeFile(wb, 'Reporte_Inventario_Actual_Velox.xlsx');
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Catálogo y Reporte de Inventario Actual - VELOX', 14, 20);
    const filasTabla = this.datosReporte.map((item) => [item.codigo, item.marca, item.modelo, item.tipo, `$${item.precio.toLocaleString()}`, item.stock !== null ? item.stock : 0]);
    autoTable(doc, { head: [['Código', 'Marca', 'Modelo', 'Categoría', 'Precio Unit.', 'Stock']], body: filasTabla, startY: 30 });
    doc.save('Catalogo_Actual_Velox.pdf');
  }

  estaEnRango(fechaComparar: string | Date, inicioStr: string, finStr: string): boolean {
    if (!inicioStr && !finStr) return true;
    const fecha = new Date(fechaComparar);
    fecha.setHours(0, 0, 0, 0);

    if (inicioStr) {
      const inicio = new Date(inicioStr);
      inicio.setHours(0, 0, 0, 0);
      if (fecha < inicio) return false;
    }
    if (finStr) {
      const fin = new Date(finStr);
      fin.setHours(23, 59, 59, 999);
      if (fecha > fin) return false;
    }
    return true;
  }

  aplicarFiltrosCronologicos() {
    this.filtrarVentas();
    this.filtrarMovimientos();
  }

  // VENTAS
  historialVentas: any[] = [];
  ventasFiltradas: any[] = [];
  fechasVentas = { inicio: '', fin: '' };
  filtroCliente: string = '';
  clientesUnicos: string[] = [];
  mostrarDropdownCliente: boolean = false;

  cargarHistorialVentas() {
    this.ventaService.listarTodas().subscribe({
      next: (ventasDesdeJava) => {
        this.historialVentas = ventasDesdeJava.map((venta) => ({
          idFactura: `FAC-${venta.idVenta}`,
          fechaOriginal: venta.fecha,
          fecha: new Date(venta.fecha).toLocaleDateString(),
          cliente: venta.usuario.nombre,
          total: venta.total,
          estado: 'Completada',
          detalles: venta.detalles.map((d: any) => ({ cantidad: d.cantidad, marca: d.bicicleta.marca, modelo: d.bicicleta.modelo, precio: d.subtotal / d.cantidad })),
        }));
        this.clientesUnicos = [...new Set(this.historialVentas.map(v => v.cliente))];
        this.filtrarVentas();
      }
    });
  }

  filtrarVentas() {
    this.ventasFiltradas = this.historialVentas.filter(v => {
      const cumpleCliente = this.filtroCliente ? v.cliente === this.filtroCliente : true;
      const cumpleFecha = this.estaEnRango(v.fechaOriginal, this.fechasVentas.inicio, this.fechasVentas.fin);
      return cumpleCliente && cumpleFecha;
    });
    this.cdr.detectChanges();
  }

  limpiarFechasVentas() { this.fechasVentas = { inicio: '', fin: '' }; this.filtrarVentas(); }
  get clientesSugeridos() { return this.clientesUnicos.filter(c => c.toLowerCase().includes(this.filtroCliente.toLowerCase())); }
  seleccionarCliente(cliente: string) { this.filtroCliente = cliente; this.mostrarDropdownCliente = false; this.filtrarVentas(); }
  limpiarFiltroCliente() { this.filtroCliente = ''; this.filtrarVentas(); }

  exportarVentasExcel() {
    const datos = this.ventasFiltradas.map((v) => ({ 'No. Factura': v.idFactura, 'Fecha': v.fecha, 'Cliente': v.cliente, 'Total Venta': v.total, 'Estado': v.estado }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, `Reporte_Ventas_${this.filtroCliente || 'Todas'}.xlsx`);
  }

  exportarVentasPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Historial de Ventas ${this.filtroCliente ? '- ' + this.filtroCliente : ''}`, 14, 20);
    const filas = this.ventasFiltradas.map((v) => {
      let resumen = v.detalles && v.detalles.length > 0 ? v.detalles.map((i: any) => `${i.cantidad}x ${i.modelo}`).join('\n') : 'Sin detalles';
      return [v.idFactura, v.fecha, v.cliente, resumen, `$${v.total.toLocaleString()}`, v.estado];
    });
    autoTable(doc, { head: [['Factura', 'Fecha', 'Cliente', 'Artículos', 'Total', 'Estado']], body: filas, startY: 30 });
    doc.save(`Ventas_${this.filtroCliente || 'Todas'}.pdf`);
  }

  // COMPRAS Y MOVIMIENTOS
  historialComprasGlobal: any[] = [];
  comprasFiltradas: any[] = [];
  fechasCompras = { inicio: '', fin: '' };
  filtroProveedor: string = '';
  proveedoresUnicos: string[] = [];
  mostrarDropdownProveedor: boolean = false;

  movimientosOriginales: any[] = [];
  movimientosFiltrados: any[] = [];
  fechasMovimientos = { inicio: '', fin: '' };
  filtroMovimiento: string = 'TODOS';

  cargarMovimientos() {
    this.http.get<any[]>('http://localhost:8080/api/movimientos').subscribe({
      next: (datos) => {
        this.movimientosOriginales = datos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.historialComprasGlobal = this.movimientosOriginales
          .filter(m => m.tipo.toUpperCase().includes('ENTRADA'))
          .map(m => ({
            idRegistro: `COMP-${m.idMovimiento || Math.floor(Math.random() * 9000) + 1000}`,
            fechaOriginal: m.fecha, fecha: new Date(m.fecha).toLocaleDateString(),
            proveedor: m.bicicleta?.proveedor?.nombre || m.proveedorNombre || 'Proveedor Asociado',
            articulo: `${m.bicicleta?.marca || ''} ${m.bicicleta?.modelo || m.codigoBicicleta}`,
            cantidad: m.cantidad, costoEstimado: m.cantidad * (m.bicicleta?.precio || 0)
          }));

        this.proveedoresUnicos = [...new Set(this.historialComprasGlobal.map(c => c.proveedor))];
        this.filtrarMovimientos();
        this.filtrarCompras();
      }
    });
  }

  filtrarCompras() {
    this.comprasFiltradas = this.historialComprasGlobal.filter(c => {
      const cumpleProv = this.filtroProveedor ? c.proveedor === this.filtroProveedor : true;
      const cumpleFecha = this.estaEnRango(c.fechaOriginal, this.fechasCompras.inicio, this.fechasCompras.fin);
      return cumpleProv && cumpleFecha;
    });
    this.cdr.detectChanges();
  }

  limpiarFechasCompras() { this.fechasCompras = { inicio: '', fin: '' }; this.filtrarCompras(); }
  get proveedoresSugeridos() { return this.proveedoresUnicos.filter(p => p.toLowerCase().includes(this.filtroProveedor.toLowerCase())); }
  seleccionarProveedor(prov: string) { this.filtroProveedor = prov; this.mostrarDropdownProveedor = false; this.filtrarCompras(); }
  limpiarFiltroProveedor() { this.filtroProveedor = ''; this.filtrarCompras(); }

  exportarComprasExcel() {
    const datos = this.comprasFiltradas.map((c) => ({ 'ID Registro': c.idRegistro, 'Fecha': c.fecha, 'Proveedor': c.proveedor, 'Artículo': c.articulo, 'Cantidad': c.cantidad, 'Costo Est.': c.costoEstimado }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Compras');
    XLSX.writeFile(wb, `Compras_${this.filtroProveedor || 'Todas'}.xlsx`);
  }

  exportarComprasPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Compras a Proveedores ${this.filtroProveedor ? '- ' + this.filtroProveedor : ''}`, 14, 20);
    const filas = this.comprasFiltradas.map((c) => [c.idRegistro, c.fecha, c.proveedor, c.articulo, c.cantidad.toString(), `$${c.costoEstimado.toLocaleString()}`]);
    autoTable(doc, { head: [['Registro', 'Fecha', 'Proveedor', 'Artículo', 'Cant.', 'Costo']], body: filas, startY: 30 });
    doc.save(`Compras_${this.filtroProveedor || 'Todas'}.pdf`);
  }

  // 🔥 AQUÍ ESTÁ EL ARREGLO DEL PLURAL/SINGULAR 🔥
  filtrarMovimientos() {
    this.movimientosFiltrados = this.movimientosOriginales.filter(m => {
      let tipoBusqueda = this.filtroMovimiento;
      if (tipoBusqueda === 'ENTRADAS') tipoBusqueda = 'ENTRADA';
      if (tipoBusqueda === 'SALIDAS') tipoBusqueda = 'SALIDA';

      const cumpleTipo = this.filtroMovimiento === 'TODOS' ? true : m.tipo.toUpperCase().includes(tipoBusqueda);
      const cumpleFecha = this.estaEnRango(m.fecha, this.fechasMovimientos.inicio, this.fechasMovimientos.fin);
      return cumpleTipo && cumpleFecha;
    });
    this.cdr.detectChanges();
  }

  limpiarFechasMovimientos() { this.fechasMovimientos = { inicio: '', fin: '' }; this.filtrarMovimientos(); }

  exportarMovimientosExcel() {
    const datos = this.movimientosFiltrados.map((m) => ({ 'Fecha': new Date(m.fecha).toLocaleString(), 'Tipo': m.tipo, 'Cód. Bicicleta': m.bicicleta?.codigo || m.codigoBicicleta || 'N/A', 'Cantidad': m.cantidad, 'Observación': m.observacion }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');
    XLSX.writeFile(wb, `Movimientos_Velox_${this.filtroMovimiento}.xlsx`);
  }

  exportarMovimientosPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Registro de Movimientos (${this.filtroMovimiento})`, 14, 20);
    const filas = this.movimientosFiltrados.map((m) => [new Date(m.fecha).toLocaleString(), m.tipo, m.bicicleta?.codigo || m.codigoBicicleta || 'N/A', m.cantidad.toString(), m.observacion]);
    autoTable(doc, { head: [['Fecha', 'Tipo', 'Bicicleta', 'Cant.', 'Observación']], body: filas, startY: 30 });
    doc.save(`Movimientos_Velox_${this.filtroMovimiento}.pdf`);
  }
}
