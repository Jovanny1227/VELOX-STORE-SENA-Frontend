import { Component, ChangeDetectorRef } from '@angular/core'; // <--- IMPORTAMOS AQUÍ
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  registroForm: FormGroup;
  cargando: boolean = false;
  error: string = '';
  mensajeExito: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef, // <--- LO INYECTAMOS AQUÍ
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    // ATENCIÓN: Ajusta 'http://localhost:8080/api/clientes' si tu Swagger dice otra URL
    this.http.post('http://localhost:8080/api/clientes', this.registroForm.value).subscribe({
      next: () => {
        this.cargando = false;
        this.mensajeExito = '¡Cuenta creada con éxito! Redirigiendo al acceso...';

        this.cdr.detectChanges(); // 🔥 PELLIZCO 1: Muestra el mensaje de éxito al instante 🔥

        // Esperamos 2.5 segundos para que el usuario lea el mensaje y lo mandamos al login
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'Hubo un error al crear la cuenta. Es posible que el correo ya exista.';
        console.error(err);

        this.cdr.detectChanges(); // 🔥 PELLIZCO 2: Muestra el error rojo al instante 🔥
      },
    });
  }
}
