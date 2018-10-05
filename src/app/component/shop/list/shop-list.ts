import { Component, Input } from "@angular/core";

@Component({
    selector: 'shop-list',
    templateUrl: 'shop-list.html'
})
export class ShopListComp
{
    constructor()
    {}

    @Input() shopList: any;
    @Input() type: string;
    @Input() geohash: string;

    touchend: boolean = false;
    showBackStatus: string = '';
}