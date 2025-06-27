import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) {}

  getData() {
    const sheetId = '1mBvCVyLuNXpskSi9WglJZNHNzOzped1HYlOsLUrsZgI';
    const sheetName = 'Лист1';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
    return this.http.get(url, { responseType: 'text' });
  }

  parseCsvData(csvText: string): Item[] {
    const lines = csvText.trim().split('\n');
    const headers = ['id', 'name', 'description', 'price', 'image', 'category'];
    return lines.slice(0).map(line => {
      const values = line.split(',').map(v => v.replaceAll ('"', ""));
      const res = values.slice(0, 2).concat(values.slice(2, -3).join()).concat(values.slice(-3, values.length));
      const obj: any = {};

      headers.forEach((key, index) => {
        obj[key] = res[index];
      });
      return obj as Item;
    });
  }

}
