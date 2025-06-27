import { Component, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Item } from '../interfaces/item';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-items-list',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.css'
})
export class ItemsListComponent implements AfterViewInit {
  data: Item[] = [];
  categories:Set<string> = new Set<string>();
  category_filter: [[string, Item[]]] = [['', []]];
  activeSection:string = '';

  @ViewChildren('categorySection') categorySections!: QueryList<ElementRef>;
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;
  constructor(private apiService:ApiService){}

   ngOnInit() {
    this.apiService.getData().subscribe(
      (csvText) => {
        this.data = this.apiService.parseCsvData(csvText);
        this.data.shift();
        for(let i of this.data){
            this.categories.add(i.category);
          }
          this.categories.delete("Категория");

        let prev_category = '';
        for(let i of this.categories){
          if(i === prev_category) continue;

          let items = [];
          for(let j of this.data){
            if(j.category === i){
              items.push(j);
            }
          }

          this.category_filter.push([i, items]);
          prev_category = i;
        }
        this.category_filter.shift();
        console.log(this.category_filter);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

  }
  
  ngAfterViewInit(): void {
    const threshold = window.innerWidth <= 600 ? 0.02 : 0.2;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (visible.length > 0) {
        // Берём ближайший к верху
        const topMost = visible.reduce((prev, curr) =>
          prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
        );
        if (this.activeSection !== topMost.target.id) {
          this.activeSection = topMost.target.id;
          this.scrollToActiveMenu();
        }
      }
    }, { threshold});

    const observeSections = () => {
      this.categorySections.forEach(section => {
        observer.observe(section.nativeElement);
      });
    };

    this.categorySections.changes.subscribe(() => {
      observeSections();
    });
    observeSections();
  }

  scrollToActiveMenu() {
    const inline = window.innerWidth <= 600 ? 'start' : 'center';
    setTimeout(() => {
      const active = this.menuItems.find(
        el => el.nativeElement.classList.contains('active')
      );
      if (active) {
        active.nativeElement.scrollIntoView({ behavior: 'smooth', inline: inline, block: 'nearest' });
      }
    });
  }
}