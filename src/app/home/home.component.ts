import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ItemsListComponent } from "../items-list/items-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, ItemsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
