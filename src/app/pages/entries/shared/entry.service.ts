import { Injectable, Injector } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { catchError, filter, mergeAll, mergeMap, toArray } from 'rxjs/operators';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected override injector: Injector,
    private _categoryService: CategoryService,
  ) {
    super('api/entries', injector, Entry.fromJson);
  }

  override create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  override update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  public getByMonthandYear(month: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      mergeAll(),
      filter(entry => {
        const date = moment(entry.date, 'DD/MM/YYYY')
        return date.year() == year && date.month() + 1 == month;
      }),
      toArray()
    )
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: (entry: Entry) => Observable<Entry>): Observable<Entry> {
    return this._categoryService.getById(entry.categoryId!).pipe(
      mergeMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError),
    );
  }
}
