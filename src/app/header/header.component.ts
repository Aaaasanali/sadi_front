import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Item } from '../interfaces/item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  data:Item[] = [];
  categories:Set<string> = new Set<string>();
  constructor(private apiService:ApiService){}

    ngOnInit() {
      this.apiService.getData().subscribe(
        (csvText) => {
          this.data = this.apiService.parseCsvData(csvText);
          for(let i of this.data){
            this.categories.add(i.category);
          }
          this.categories.delete("Категория");
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }
}
