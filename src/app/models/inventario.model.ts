export interface Inventario {
  codigo: string;
  marca: string;
  modelo: string;
  tipo: string;           // convertimos TipoBicicleta a string para el frontend
  precio: number;         // BigDecimal → number
  stock: number;          // cantidad disponible
}
