import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath = 'api/entries';

  constructor(
    private _http: HttpClient,
    private _categoryService: CategoryService
  ) { }

  getAll(): Observable<Entry[]> {
    return this._http.get<Entry[]>(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    );
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.apiPath}/${id}`;
    return this._http.get<Entry>(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    );
  }

  create(entry: Entry): Observable<Entry> {
    return this._categoryService.getById(entry.categoryId!).pipe(
      mergeMap(category => {
        entry.category = category;
        return this._http.post<Entry>(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        );
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;

    return this._categoryService.getById(entry.categoryId!).pipe(
      mergeMap(category => {
        entry.category = category;
        return this._http.put<Entry>(url, entry).pipe(
          catchError(this.handleError),
          map(() => entry)
        );
      })
    );
  }

  delete(id?: number): Observable<void> {
    const url = `${this.apiPath}/${id}`;
    return this._http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  // #region Private METHODS
  private jsonDataToEntries(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];
    jsonData.forEach(entry => {
      const entryAssigned = Object.assign(new Entry(), entry);
      entries.push(entryAssigned);
    });
    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(() => error);
  }
  // #endregion
}
