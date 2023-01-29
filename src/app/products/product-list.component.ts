import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
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
// CHECK ALT PRODUCT COMPONENT FOR CLEAN CODE
  //products: Product[] = [];
  // Commented code is not required as we are giving the option sub/unsub to rxjs 
  // by declaring async pipe products$ as below
  //products$:Observable<Product[]> | undefined=this.productService.products$;
  products$=this.productService.products$
  .pipe(
      catchError(
        err=>{
          this.errorMessage=err;
          return EMPTY;
          //return([]);
        })
    );
  //sub!: Subscription;

  constructor(private productService: ProductService) { }

  // When you follow RxJS declarative pattern , you dont assign product variable in ngOnInit
  ngOnInit(): void {
    // this.sub = this.productService.getProducts()
    //   .subscribe({
    //     next: products => this.products = products,
    //     error: err => this.errorMessage = err
    //   });

    // Using async declared pipe products$
    // this.products$=this.productService.getProducts()
    // .pipe(
    //   catchError(
    //     err=>{
    //       this.errorMessage=err;
    //       return EMPTY;
    //       //return([]);
    //     })
    // )
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
