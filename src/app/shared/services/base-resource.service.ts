import { HttpClient } from "@angular/common/http";
import { BaseResourceModel } from "../models/base-resource.model";
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injector } from "@angular/core";

export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected _http: HttpClient;

  constructor(
    protected apiPath: string,
    protected injector: Injector,
  ) {
    this._http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this._http.get<T[]>(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources)
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this._http.get<T>(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  create(resource: T): Observable<T> {
    return this._http.post<T>(this.apiPath, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource)
    );
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this._http.put<T>(url, resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  delete(id?: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this._http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  // #region Protected METHODS
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(category => resources.push(category as T));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return jsonData as T;
  }

  protected handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(() => error);
  }
  // #endregion
}
