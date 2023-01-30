import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  Observable,
  tap,
  throwError,
  map,
  combineLatest,
  BehaviorSubject,
  Subject,
  merge,
  scan,
  shareReplay,
  filter,
  switchMap,
  forkJoin,
  of,
} from 'rxjs';
import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { SupplierService } from '../suppliers/supplier.service';
import { Supplier } from '../suppliers/supplier';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  //private productsUrl = 'api/product'; // for error testing
  private suppliersUrl = 'api/suppliers';

  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private productCategoryService: ProductCategoryService,
    private supplierService: SupplierService
  ) {}

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl)
  //     .pipe(
  //       tap(data => console.log('Products: ', JSON.stringify(data))),
  //       catchError(this.handleError)
  //     );
  // }
  // Declaring getProducts in service and consuming in the component is procedural pattern
  // using Declarative pattern we are declaring the property , and assigning Http get
  productsInit$ = this.http.get<Product[]>(this.productsUrl).pipe(
    //map(item=>item.price *1.5) // http get returns list of array not each element
    map((products) =>
      products.map(
        (product) =>
          ({
            ...product, // spread operator copies all the common product properties which are not going to moify/transform
            price: product.price ? product.price * 1.5 : 0,
            searchKey: [product.productName],
          } as Product)
      )
    ),
    tap((data) => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((data) => console.log('Products: ', JSON.stringify(data))),
    catchError(this.handleError)
  );

  productWithCategory$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$,
  ]).pipe(
    map(([products, categories]) =>
      products.map(
        (product) =>
          ({
            ...product,
            price: product.price ? product.price * 1.5 : 0,
            category: categories.find((c) => product.categoryId === c.id)?.name,
            searchKey: [product.productName],
          } as Product)
      )
    )
    //shareReplay(1)
  );
  private productInsertedSubject = new Subject<Product>();
  productedInsertedAction$ = this.productInsertedSubject.asObservable();

  productsWithAdd$ = merge(
    this.productWithCategory$,
    this.productedInsertedAction$
  ).pipe(
    scan(
      (acc, value) => (value instanceof Array ? [...value] : [...acc, value]),
      [] as Product[]
    )
  );

  selectedProduct$ = combineLatest([
    this.productWithCategory$,
    this.productSelectedAction$,
  ]).pipe(
    map(([products, selectedProductId]) =>
      products.find((product) => product.id === selectedProductId)
    ),
    tap((product) => console.log('selectedProduct', product))
    //shareReplay(1)
  );

  // this.productWithCategory$.pipe(
  //   map((products) => products.find((product) => product.id === 5)),
  //   tap((data) => console.log('selectedProduct', data))
  // );

  selectedProductChanged(selectedProductId: number): void {
    this.productSelectedSubject.next(+selectedProductId);
  }

  addProduct(newProduct?: Product) {
    newProduct = newProduct || this.fakeProduct();
    this.productInsertedSubject.next(newProduct);
  }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30,
    };
  }

  // All streams data
  // selectedProductSupplier$ = combineLatest([
  //   this.selectedProduct$,
  //   this.supplierService.suppliers$,
  // ]).pipe(
  //   map(([selectedProduct, suppliers]) =>
  //     suppliers.filter((supplier) =>
  //       selectedProduct?.supplierIds?.includes(supplier.id)
  //     )
  //   )
  // );

  // Just in time approach
  selectedProductSupplier$ = this.selectedProduct$.pipe(
    filter((product) => Boolean(product)),
    switchMap((selectedProduct) => {
      if (selectedProduct?.supplierIds) {
        return forkJoin(
          selectedProduct.supplierIds.map((supplierId) =>
            this.http.get<Supplier>(`${this.suppliersUrl}/${supplierId}`)
          )
        );
      }else{
        return of([]);
      }
    }),
    tap(suppliers=>console.log('Product Suppliers',JSON.stringify(suppliers)))
  );
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
