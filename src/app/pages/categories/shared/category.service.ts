import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath = 'api/categories';

  constructor(private _http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this._http.get<Category[]>(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    );
  }

  getById(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`
    return this._http.get<Category>(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    );
  }

  create(category: Category): Observable<Category> {
    return this._http.post<Category>(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    );
  }

  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category.id}`
    return this._http.put<Category>(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    );
  }

  delete(id?: number): Observable<void> {
    const url = `${this.apiPath}/${id}`
    return this._http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  // #region Private METHODS
  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(category => categories.push(category as Category));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(() => error);
  }
  // #endregion
}
