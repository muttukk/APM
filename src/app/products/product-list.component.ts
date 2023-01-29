import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { catchError, EMPTY, Observable } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit{ //,OnDestroy { 
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];

  //products: Product[] = [];
  // Commented code is not required as we are giving the option sub/unsub to rxjs 
  // by declaring async pipe products$ as below
  products$:Observable<Product[]> | undefined;
  //sub!: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // this.sub = this.productService.getProducts()
    //   .subscribe({
    //     next: products => this.products = products,
    //     error: err => this.errorMessage = err
    //   });
    this.products$=this.productService.getProducts()
    .pipe(
      catchError(
        err=>{
          this.errorMessage=err;
          return EMPTY;
          //return([]);
        })
    )
  }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
