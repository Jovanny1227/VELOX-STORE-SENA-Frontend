// Importamos la interfaz real de la bicicleta
import { Bicicleta } from './bicicleta.model';

// Interfaz segregada para el Detalle
export interface DetalleVenta {
  idDetalle?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  // Dependemos de la abstracción estricta, cero "any"
  bicicleta: Bicicleta;
}

// Interfaz principal (Aggregate Root)
export interface Venta {
  idVenta?: number;
  nombreCliente: string;
  fecha: string;
  total: number;
  // La venta compone a sus detalles
  detalles: DetalleVenta[];
}
