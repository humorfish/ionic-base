import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class ShopService
{
    constructor()
    {}

    setShopDetailData(data: any)
    {
        this.shopDetailData = data;
        this.updateData.emit('update');
    }
    
    setRatingScoresData(data: any)
    {
        this.ratingScoresData = data;
        this.updateData.emit('update');
    }

    setRatingList(data: any)
    {
        this.ratingList = data;
        this.updateData.emit('update');
    }

    shopDetailData: any;
    ratingScoresData: any;
    ratingList: any;
    updateData: EventEmitter<any> = new EventEmitter();
    loaderMoreRatings: EventEmitter<any> = new EventEmitter();
}