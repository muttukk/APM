import { ChangeDetectionStrategy, Component} from '@angular/core';
import { catchError, EMPTY, Subject } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent  {
  pageTitle = 'Products';
  private errorMessageSubject=new Subject<string>();
  errorMessage$=this.errorMessageSubject.asObservable();
  selectedProductId = 0;

  products$=this.productService.productWithCategory$
  .pipe(
      catchError(
        err=>{
          this.errorMessageSubject.next(err);
          return EMPTY;
        })
    );
  

  constructor(private productService: ProductService) { }

  selectedProduct$=this.productService.selectedProduct$;

 
  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
