import { Component, ChangeDetectorRef } from '@angular/core'; // <--- IMPORTAMOS AQUÍ
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef, // <--- LO INYECTAMOS AQUÍ
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.cargando = true;
      this.error = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.cargando = false;

          // Redirección dependiendo del rol
          if (res.rol === 'ADMIN') {
            this.router.navigate(['/admin/inventario']);
          } else {
            this.router.navigate(['/']);
          }

          this.cdr.detectChanges(); // Nos aseguramos de que actualice la vista al instante
        },
        error: (err) => {
          this.cargando = false;
          this.error = 'Correo o contraseña incorrectos. Verifica tus credenciales.';

          this.cdr.detectChanges(); // 🔥 EL PELLIZCO: Muestra el error rojo al instante 🔥
        },
      });
    }
  }
}
