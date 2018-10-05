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

// import { DirectivesModule } from '../directives';
const coms: any[] = [
  ShopListComp,
  ShopMsiteComp,
  ElmSvgComp,
  RatingStarComp,
  LoadingComp
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
