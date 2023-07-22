import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductColor } from '../models/ProductColor';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductColorService {

  constructor(private httpClient: HttpClient) { }


  getProductColorList(): Observable<ProductColor[]> {

    return this.httpClient.get<ProductColor[]>(environment.getApiUrl + '/productColors/getall')
  }

  getProductColorById(id: number): Observable<ProductColor> {
    return this.httpClient.get<ProductColor>(environment.getApiUrl + '/productColors/getbyid?id='+id)
  }

  addProductColor(productColor: ProductColor): Observable<any> {

    return this.httpClient.post(environment.getApiUrl + '/productColors/', productColor, { responseType: 'text' });
  }

  updateProductColor(productColor: ProductColor): Observable<any> {
    return this.httpClient.put(environment.getApiUrl + '/productColors/', productColor, { responseType: 'text' });

  }

  deleteProductColor(id: number) {
    return this.httpClient.request('delete', environment.getApiUrl + '/productColors/', { body: { id: id } });
  }


}