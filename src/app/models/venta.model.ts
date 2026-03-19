export interface Venta {
  idVenta?: number;
  cliente?: { nombre: string; documento: string };
  fecha?: string;
  total?: number;
  estado?: string;
}
