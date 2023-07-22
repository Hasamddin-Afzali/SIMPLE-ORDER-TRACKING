import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock';
import { environment } from 'environments/environment';
import { StockDto } from '../models/stockDto';
import { ProductDto } from '../../product/models/productDto';


@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private httpClient: HttpClient) { }


  getStockDtoList(): Observable<StockDto[]> {

    return this.httpClient.get<StockDto[]>(environment.getApiUrl + '/stocks/getallDto')
  }
  getProductDtoList(): Observable<ProductDto[]> {

    return this.httpClient.get<ProductDto[]>(environment.getApiUrl + '/products/getallDto')
  }

  getStockById(id: number): Observable<Stock> {
    return this.httpClient.get<Stock>(environment.getApiUrl + '/stocks/getbyid?id='+id)
  }

  addStock(stock: Stock): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/stocks/', stock, { responseType: 'text' });
  }

  updateStock(stock: Stock): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/stocks/', stock, { responseType: 'text' });

  }

  deleteStock(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/stocks/', { body: { id: id } });
  }


}