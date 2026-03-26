import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../models/cliente.model'; //

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css'],
})
export class ClienteListComponent {
  @Input() clientes: Cliente[] = [];
  @Output() onEditar = new EventEmitter<Cliente>();
  @Output() onEliminar = new EventEmitter<number>();
}
