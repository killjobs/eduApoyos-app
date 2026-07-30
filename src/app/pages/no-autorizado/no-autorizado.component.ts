import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-autorizado',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './no-autorizado.component.html',
  styleUrl: './no-autorizado.component.scss'
})
export class NoAutorizadoComponent {

}
