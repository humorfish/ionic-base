import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';

import { SharedModule } from "../shared";
import { ShopPage } from "./shop.page";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                redirectTo: 'car',
                pathMatch: 'full'
            },
            {
                path: 'car',
                component: ShopPage,
                children: []
            }
        ])
    ],
    declarations: [ShopPage]
})
export class ShopPageModule
{}