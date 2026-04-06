import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
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

    this.authService.register(this.registroForm.value).subscribe({
      next: () => {
        this.cargando = false;
        this.mensajeExito = '¡Cuenta creada con éxito! Redirigiendo al acceso...';

        this.cdr.detectChanges();

        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err: any) => {
        this.cargando = false;
        this.error = 'Hubo un error al crear la cuenta. Es posible que el correo ya exista.';
        console.error(err);

        this.cdr.detectChanges();
      },
    });
  }
}
