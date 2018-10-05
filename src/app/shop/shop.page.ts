import { Component, OnInit, ElementRef } from "@angular/core";

import { ActivatedRoute, Router, Params } from "@angular/router";
import { UserInfo, AppService, DataService, ShopService } from "../provider";
import { ImgBaseUrl } from "../config/env";
import { CartService } from "../provider/cart.service";

@Component({
    selector: 'page-shop',
    templateUrl: 'shop.page.html',
    styleUrls: ['shop.page.scss']
})
export class ShopPage extends UserInfo implements OnInit
{
    constructor(public appService: AppService,
        public shopSvc: ShopService,
        public dataSvc: DataService,
        public carSvc: CartService,
        public activedRoute: ActivatedRoute,
        public router: Router,
        public el: ElementRef)
    {
        super(appService);
    }

    ngOnInit(): void
    {
        this.activedRoute.queryParams.subscribe((params: Params) => {
            this.geohash = params['geohash'];
            this.shopId = params['id'];
            // 获取商铺信息
            this.getShopDetails();
            // 获取商铺食品列表
            this.getFoodMenu();
            // 商铺评论详情
            this.ratingScores();
            // 评论列表
            this.getRatingList(0);
        });
    }

    goBack()
    {
        window.history.back();
    }

    getShopDetails()
    {
        this.dataSvc.getShopDetails(this.shopId, this.geohash)
            .then(res => {
                this.shopDetailData = res;
                this.shopSvc.setShopDetailData(res);
                this.promotionInfo = res.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。';
            })
            .catch(err => console.log(err));
    }

    getFoodMenu()
    {
        this.dataSvc.getFoodMenu(this.shopId)
            .then(res => {
                this.menuList = res;
                this.menuFood = this.menuList[0];
                this.initCategoryNum();
            })
            .catch(err => console.log(err));
    }

    chooseMenu(index)
    {
        this.menuIndex = index;
        this.menuFood = this.menuList[index];
    }

    shopCartChange()
    {
        this.shopCart = { ...this.carSvc.cartList[this.shopId] };
        this.initCategoryNum();
    }

    initCategoryNum() {
        let newArr = [];
        let cartFoodNum = 0;
        this.totalPrice = 0;
        this.cartFoodList = [];
        this.menuList.forEach((item, index) => {
          if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
            let num = 0;
            Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemid => {
              Object.keys(this.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
                let foodItem = this.shopCart[item.foods[0].category_id][itemid][foodid];
                num += foodItem.num;
                if (item.type === 1) {
                  this.totalPrice += foodItem.num * foodItem.price;
                  if (foodItem.num > 0) {
                    this.cartFoodList[cartFoodNum] = {};
                    this.cartFoodList[cartFoodNum].category_id = item.foods[0].category_id;
                    this.cartFoodList[cartFoodNum].item_id = itemid;
                    this.cartFoodList[cartFoodNum].food_id = foodid;
                    this.cartFoodList[cartFoodNum].num = foodItem.num;
                    this.cartFoodList[cartFoodNum].price = foodItem.price;
                    this.cartFoodList[cartFoodNum].name = foodItem.name;
                    this.cartFoodList[cartFoodNum].specs = foodItem.specs;
                    cartFoodNum++;
                  }
                }
              });
            });
            newArr[index] = num;
          } else {
            newArr[index] = 0;
          }
        });
        this.totalPrice = this.totalPrice.toFixed(2);
        this.categoryNum = [...newArr];
    }

    getRatingList(ratingOffset: number, name?: string)
    {
        this.dataSvc.getRatingList(this.shopId)
            .then(res => {
                this.shopSvc.setRatingList(res);
            })
            .catch(err => console.log(err));
    }
    
    ratingScores()
    {
        this.dataSvc.getRatingScores(this.shopId)
            .then(res => {
                this.ratingScoresData = res;
                this.shopSvc.setRatingScoresData(res);
            })
            .catch(err => console.log(err));
    }
    
    getImgPath(path)
    {
        let suffix;
        if (!path)
          return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg';
        
        if (path.indexOf('jpeg') !== -1)
        {
          suffix = '.jpeg';
        }
        else
        {
          suffix = '.png';
        }
        const url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
        return 'https://fuss10.elemecdn.com' + url;
    }
    
    minimumOrderAmount()
    {
        if (this.shopDetailData)
        {
          return this.shopDetailData.float_minimum_order_amount - this.totalPrice;
        }
        else
        {
          return null;
        }
    }
    
    // 购物车中总共商品的数量
    totalNum()
    {
        let num = 0;
        this.cartFoodList.forEach(item => {
            num += item.num;
        });
        return num;
    }

    geohash: string;
    shopId: string;
    cartFoodList: any[] = [];
    shopDetailData: any; // 商铺详情
    showActivities: boolean = false; // 是否显示活动详情
    imgBaseUrl: string = ImgBaseUrl;
    promotionInfo: string;
    
    menuList: any[] = []; // 食品列表
    menuIndex: number = 0; // 已选菜单索引值，默认为0
    menuFood: any;

    shopCart: any;
    cartState: any = 'inactive';
    categoryNum: any[] = [];
    totalPrice: any = 0; // 总共价格

    ratingScoresData: any; // 评价总体分数
    foodScroll: any;  // 食品列表scroll
    showSpecs: boolean = false; // 控制显示食品规格
    specsIndex: number = 0; // 当前选中的规格索引值
    choosedFoods: any; // 当前选中视频数据
    showDeleteTip: boolean = false; // 多规格商品点击减按钮，弹出提示框
    showMoveDot: any[] = []; // 控制下落的小圆点显示隐藏

    title: string = '';
    windowHeight: number;
}