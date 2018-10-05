import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ShopListComp } from './shop/list/shop-list';
import { ShopMsiteComp } from './shop/msite/shop-msite';
import { RatingStarComp } from './rating-star/rating-star';
import { ElmSvgComp } from './svg/svg';
import { LoadingComp } from './loading/loading';
import { BuyCartComp } from './buy-cart/buy-cart';
import { ShopEvaluateComp } from './shop/evaluate/evaluate';

// import { DirectivesModule } from '../directives';
const coms: any[] = [
  ShopListComp,
  ShopMsiteComp,
  ElmSvgComp,
  RatingStarComp,
  LoadingComp,
  BuyCartComp,
  ShopEvaluateComp
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule.forRoot(),
  ],
  declarations: [
    coms
  ],
  exports: [
    coms
  ],
  entryComponents: [],
})
export class ComponentsModule { }
