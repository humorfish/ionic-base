import { OnInit, Component } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DataService } from "../../provider";

@Component({
    selector: 'msite-page',
    templateUrl: 'msite.page.html',
    styleUrls: ['msite.page.scss']
})
export class MsitePage implements OnInit
{
    constructor(private activedRoute: ActivatedRoute, private dataSvc: DataService)
    {  
    }

    ngOnInit()
    {
        this.activedRoute.queryParams.subscribe((params: Params) => {
            this.geohash =  params['geohash'];
            if (this.geohash) {
                this.latitude = this.geohash.split(',')[0];
                this.longitude = this.geohash.split(',')[1];
                this.getPoisGeohash();
                this.getMsiteFoodTypes();
                this.getShopList();
            }
            else
            {
                this.dataSvc.getGuessCity().then(res => {
                    this.latitude = res.latitude;
                    this.longitude = res.longitude;
                    this.geohash = res.latitude + ',' + res.longitude;
                    this.getPoisGeohash();
                    this.getMsiteFoodTypes();
                    this.getShopList();
                });
            }
        });  
    }

    goBack()
    {
        window.history.back();
    }

    getPoisGeohash()
    {
        this.dataSvc.getPoisGeohash(this.geohash)
            .then(res =>
            {
                this.title = res.name;
                this.hasGetData = true;
            })
            .catch(err => console.log(err));
    }

    getMsiteFoodTypes()
    {
        this.dataSvc.getMsiteFoodTypes(this.geohash)
            .then(res =>
            {
                this.foodTypes = this.spliceArray([...res], 8);
            })
            .catch(err => console.log(err));
    }

    getShopList()
    {
        this.dataSvc.getShopList(this.geohash)
            .then(res =>
            {
                console.log(res);
                if (res.length < 20)
                    this.touchend = true;
                
                this.shopList = [...this.shopList, ...res];
                this.showLoading = false;
                this.preventRepeatReuqest = false;
            })
            .catch(err => console.log(err));
    }

    spliceArray(array: any[], spliceLength: number)
    {
        let length: number = array.length;
        let foodArr: any[] = [];
        for (let i = 0, j = 0; i < length; i += spliceLength, j++)
        {
            foodArr[j] = array.splice(0, spliceLength);
        }
        return foodArr;
    }

    slideChanged($event)
    {
        let slideIndex = $event.getActiveIndex();
        this.slideActive = slideIndex % 2 !== 0;
    }

    loaderMore(event: any)
    {
        if (this.touchend)
        {
            event.target.disabled = true;
            return;
        }
        if (this.preventRepeatReuqest)
          return;
        
        this.offset += 20;
        this.showLoading = true;
        this.preventRepeatReuqest = true;
        this.getShopList();
        event.target.complete();
    }

    title: string = '';
    hasGetData: boolean = false;
    geohash: string = null;
    latitude: string;
    longitude: string;
    imgBaseUrl = 'https://fuss10.elemecdn.com';

    foodTypes: any[] = [];
    shopList: any[] = [];
    slideActive: boolean;

    touchend: boolean = false;
    showLoading: boolean = false;
    preventRepeatReuqest: boolean = false; // 到达底部加载数据，防止重复加载
    offset: number;
}