export interface Bicicleta {
  idBicicleta?: number;
  codigo?: string;
  marca: string;
  modelo: string;
  precio: number;
  tipo: string;
  proveedorNombre?: string;
}

// Estructura individual para el formulario masivo
export interface ItemBicicleta {
  modelo: string;
  marca: string;
  precio: number;
  tipo: string;
  proveedorId: number;
  cantidad: number;
}

// Lo que enviamos al Backend
export interface BicicletaMasivaRequest {
  items: ItemBicicleta[];
}
