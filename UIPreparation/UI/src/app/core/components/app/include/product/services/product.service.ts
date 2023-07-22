import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ProductDto } from '../models/productDto';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  getProductList(): Observable<Product[]> {

    return this.httpClient.get<Product[]>(environment.getApiUrl + '/products/getall')
  }

  getProductDtoList(): Observable<ProductDto[]> {

    return this.httpClient.get<ProductDto[]>(environment.getApiUrl + '/products/getallDto')
  }

  getProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(environment.getApiUrl + '/products/getbyid?id='+id)
  }

  addProduct(product: Product): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/products/', product, { responseType: 'text' });
  }

  updateProduct(product: Product): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/products/', product, { responseType: 'text' });

  }

  deleteProduct(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/products/', { body: { id: id } });
  }


}