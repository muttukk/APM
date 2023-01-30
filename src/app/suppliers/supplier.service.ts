import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable, of, tap, concatMap, map, mergeMap, switchMap, shareReplay, catchError } from 'rxjs';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  suppliers$=this.http.get<Supplier[]>(this.suppliersUrl)
  .pipe(
    tap(data=>console.log('suplliers',JSON.stringify(data))),
    shareReplay(1),
    catchError(this.handleError)
  );

  supplierWithMap$=of(1,5,8)
  .pipe(
    map(id=>this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  supplierWithConcateMap$=of(1,5,8)
  .pipe(
    tap(id=>console.log('concateMap source Observable',id)),
    concatMap(id=>this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  supplierWithMergeMap$=of(1,5,8)
  .pipe(
    tap(id=>console.log('MergMap source Observable',id)),
    mergeMap(id=>this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  supplierWithSwitchMap$=of(1,5,8)
  .pipe(
    tap(id=>console.log('SwitchMap source Observable',id)),
    switchMap(id=>this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
  );

  constructor(private http: HttpClient) { 
    // this.supplierWithMap$.subscribe(innerObservable=>innerObservable.subscribe(
    //   item=>console.log('Map Result',item)
    // ));

    // this.supplierWithConcateMap$.subscribe(
    //   item=>console.log('ConcatMap Result',item)
    // );

    // this.supplierWithMergeMap$.subscribe(
    //   item=>console.log('Merge Map Result',item)
    // );

    // this.supplierWithSwitchMap$.subscribe(
    //   item=>console.log('Switch Map Result',item)
    // );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
