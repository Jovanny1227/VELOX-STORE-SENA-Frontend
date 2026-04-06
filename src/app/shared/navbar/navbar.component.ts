import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  // Variable para rastrear si se ha hecho scroll
  isScrolled = false;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  // Escuchamos el evento scroll del navegador
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Si el scroll vertical es mayor a 20px, activamos la transparencia
    this.isScrolled = window.scrollY > 20;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
