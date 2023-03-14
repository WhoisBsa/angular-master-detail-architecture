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
    protected jsonDataToResourceFn: (jsonData: any) => T,
  ) {
    this._http = injector.get(HttpClient);
  }

  getAll(): Observable<T[]> {
    return this._http.get<T[]>(this.apiPath).pipe(
      map(this.jsonDataToResources),
      catchError(this.handleError),
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;
    return this._http.get<T>(url).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError),
    );
  }

  create(resource: T): Observable<T> {
    return this._http.post<T>(this.apiPath, resource).pipe(
      map(this.jsonDataToResource.bind(this)),
      catchError(this.handleError),
    );
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;
    return this._http.put<T>(url, resource).pipe(
      map(() => resource),
      catchError(this.handleError),
    );
  }

  delete(id?: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this._http.delete(url).pipe(
      map(() => null),
      catchError(this.handleError),
    );
  }

  // #region Protected METHODS
  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(category => this.jsonDataToResourceFn(category));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(() => error);
  }
  // #endregion
}
