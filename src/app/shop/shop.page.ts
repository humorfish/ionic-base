import { Component, OnInit, ElementRef } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import {
    trigger,
    style,
    animate,
    transition
  } from '@angular/animations';

import { UserInfo, AppService, DataService, ShopService } from "../provider";
import { ImgBaseUrl } from "../config/env";
import { CartService } from "../provider/cart.service";

@Component({
    selector: 'page-shop',
    templateUrl: 'shop.page.html',
    styleUrls: ['shop.page.scss'],
    animations: [
        trigger('cartListState', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate(300)
            ]),
            transition(':leave', [
                animate(300, style({ transform: 'translateY(100%)' }))
            ])
        ]),
        trigger('flyInCart', [
            transition('void => *', animate('100ms ease-in'))
        ])
    ]
})
export class ShopPage extends UserInfo implements OnInit
{
    constructor(public appService: AppService,
        public shopSvc: ShopService,
        public dataSvc: DataService,
        public cartSvc: CartService,
        public activedRoute: ActivatedRoute,
        public router: Router,
        public el: ElementRef)
    {
        super(appService);
    }

    ngOnInit(): void
    {
        this.windowHeight = window.innerHeight;
        this.activedRoute.queryParams.subscribe((params: Params) => {
            this.geohash = params['geohash'];
            this.shopId = params['id'];
            this.showLoading = true;
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
                this.showLoading = false;
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
        this.shopCart = { ...this.cartSvc.cartList[this.shopId] };
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
        this.totalPrice = Number(this.totalPrice.toFixed(2));
        this.categoryNum = [...newArr];
    }

    getRatingList(ratingOffset: number, name?: string)
    {
        this.dataSvc.getRatingList(this.shopId, ratingOffset, name)
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
    
    getImgPath(path: string)
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

    deliveryFee()
    {
        if (this.shopDetailData)
        {
          return this.shopDetailData.float_delivery_fee;
        }
        else
        {
          return null;
        }
    }

    chooseSpecs(index)
    {
        this.specsIndex = index;
    }
    
    addSpecs(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock)
    {
        this.cartSvc.addCart({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock });
        this.onShowChooseList();
        this.shopCartChange();
    }

    // 加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    addToCart(category_id, item_id, food_id, name, price, specs)
    {
        this.cartSvc.addCart({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs });
        this.initCategoryNum();
    }
    // 移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    removeOutCart(category_id, item_id, food_id, name, price, specs)
    {
        this.cartSvc.reduceCart({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs });
        this.initCategoryNum();
        if (!this.cartFoodList.length)
            this.showCartList = false;
    }

    clearCart()
    {
        this.toggleCartList();
        this.cartSvc.clearCart(this.shopId);
        this.shopCartChange();
    }

    toggleCartList()
    {
        this.showCartList = !this.showCartList;
    }

    onShowMoveDot(event: any)
    {        
        this.showMoveDot = event.showMoveDot;
        this.elLeft = event.elLeft;
        this.elBottom = event.elBottom;
    }

    onShowChooseList(food?: any)
    {
        if (food)
            this.choosedFood = food;

        this.showSpecs = !this.showSpecs;
        this.specsIndex = 0;
    }

    animationStarted(event: any)
    {
        const el = event.element;
        el.style.transform = `translate3d(0,${29 + this.elBottom - this.windowHeight}px,0)`;
        el.children[0].style.transform = `translate3d(${this.elLeft - 22}px,0,0)`;
        el.children[0].style.opacity = 0; 
    }

    animationDone(event: any, index: number)
    {
        const el = event.element;
        el.style.transform = `translate3d(0,0,0)`;
        el.children[0].style.transform = `translate3d(0,0,0)`;
        el.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
        el.children[0].style.transition = 'transform .55s linear';
        el.children[0].style.opacity = 1;
        el.children[0].addEventListener('transitionend', () => {
            if (this.showMoveDot.length === index + 1)
            {
                this.showMoveDot = this.showMoveDot.map(item => false);
            }
            this.listenInCart();
        });
        el.children[0].addEventListener('webkitAnimationEnd', () => {
            if (this.showMoveDot.length === index + 1)
            {
                this.showMoveDot = this.showMoveDot.map(item => false);
            }
            this.listenInCart();
        });
    }
    // 监听圆点是否进入购物车
    listenInCart()
    {
        if (!this.receiveInCart)
        {
            this.receiveInCart = true;
            let el = this.el.nativeElement.getElementsByClassName('cart-icon-container')[0];
            el.addEventListener('animationend', () => {
                this.receiveInCart = false;
            });
            el.addEventListener('webkitAnimationEnd', () => {
                this.receiveInCart = false;
            });
        }
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
    categoryNum: any[] = []; // 商品类型右上角已加入购物车的数量
    totalPrice: number = 0; // 总共价格

    ratingScoresData: any; // 评价总体分数
    showSpecs: boolean = false; // 控制显示食品规格
    specsIndex: number = 0; // 当前选中的规格索引值
    choosedFood: any; // 当前选中视频数据
    showCartList: boolean = false;
    showDeleteTip: boolean = false; // 多规格商品点击减按钮，弹出提示框
    receiveInCart: boolean = false; // 购物车组件下落的圆点是否到达目标位置
    showMoveDot: any[] = []; // 控制下落的小圆点显示隐藏

    showLoading: boolean = false;
    elLeft: number = 0; // 当前点击加按钮在网页中的绝对top值
    elBottom: number = 0; // 当前点击加按钮在网页中的绝对left值
    windowHeight: number;
}