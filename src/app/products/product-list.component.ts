import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, startWith, Subject } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  //,OnDestroy {
  pageTitle = 'Product List';
  errorMessage = '';
  selectedCategoryId = 1;
  //sub!: Subscription;

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // CHECK ALT PRODUCT COMPONENT FOR CLEAN CODE
  //products: Product[] = [];
  // Commented code is not required as we are giving the option sub/unsub to rxjs
  // by declaring async pipe products$ as below
  //products$:Observable<Product[]> | undefined=this.productService.products$;

  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$
    // .pipe(
    //   startWith(0)
    // ), // use behaviour subject with init value
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter((product) =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  // Temp unused
  products1$ = this.productService.productWithCategory$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
      //return([]);
    })
  );

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  productCategoryFilter$ = this.productService.productWithCategory$.pipe(
    map((products) =>
      products.filter((product) =>
        this.selectedCategoryId
          ? product.categoryId === this.selectedCategoryId
          : true
      )
    )
  );

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
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
