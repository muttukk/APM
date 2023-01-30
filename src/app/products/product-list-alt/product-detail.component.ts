import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage = '';
  product: Product | null = null;

  constructor(private productService: ProductService) { }

  product$=this.productService.selectedProduct$
  .pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  pageTitle$ = this.product$
  .pipe(
    map(p=>p ? `Product Detail for :${p.productName}`:null)
  );

  productSuppliers$=this.productService.selectedProductSupplier$
  .pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  vm$=combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$,
  ]).pipe(
    filter(([product])=>Boolean(product)),
    map(([product,productSuppliers,pageTitle])=>
    ({product,productSuppliers,pageTitle})) 
  );

}
