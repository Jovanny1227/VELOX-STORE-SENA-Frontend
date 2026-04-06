import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

// Importa tus componentes
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

// Importamos el servicio de autenticación
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  title = 'velox-store';

  // Variable que controla si se ve el navbar y el footer
  mostrarLayout: boolean = true;

  // Variable que controla el cronómetro de inactividad
  timeoutId: any;

  constructor(
    private router: Router,
    private authService: AuthService, // Inyectamos el servicio aquí
  ) {
    // 1. Lógica original: Escuchamos los cambios de ruta para el layout
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Lista de rutas donde queremos ocultar el menú
        const rutasSinLayout = ['/login', '/registro'];
        // Si la URL actual está en la lista, mostramosLayout es falso
        this.mostrarLayout = !rutasSinLayout.includes(event.urlAfterRedirects);
      });

    // 2. Iniciamos el vigilante de inactividad apenas carga la aplicación
    this.iniciarTemporizador();
  }

  // ==========================================
  //     CONTROL DE INACTIVIDAD (SEGURIDAD)
  // ==========================================

  // @HostListener vigila toda la pantalla.
  // Si mueves el mouse o tocas una tecla, reinicia el cronómetro.
  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  resetearTemporizador() {
    clearTimeout(this.timeoutId);
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    // Verificamos si hay un usuario con sesión iniciada
    if (this.authService.currentUserValue) {
      // TIEMPO: 15 minutos en milisegundos (15 * 60 * 1000)
      // TIP PARA EL SENA: Cámbialo a 10000 (10 segundos) cuando vayas a exponer el proyecto
      const tiempoInactividad = 15 * 60 * 1000;

      this.timeoutId = setTimeout(() => {
        // Si el tiempo se agota sin que el usuario toque nada:
        alert('Por tu seguridad, hemos cerrado tu sesión por inactividad. 🔒');

        // Cerramos la sesión (usando el mismo método que usa tu Navbar)
        this.authService.logout();

        // Lo devolvems a la pantalla de login
        this.router.navigate(['/login']);
      }, tiempoInactividad);
    }
  }
}
