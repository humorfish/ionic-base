import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ToastController } from "@ionic/angular";

import { CartService } from "../../provider";

@Component({
    selector: 'buy-cart',
    templateUrl: 'buy-cart.html',
    styleUrls: ['buy-cart.scss']
})
export class BuyCartComp
{
    constructor(public cartService: CartService, public toastCtrl: ToastController)
    {}

    shopCart()
    {
        return Object.assign({}, this.cartService.cartList[this.shopId]);
    }

    foodNum()
    {
        let retVal: number = 0;
        const category_id = this.food.category_id;
        const item_id = this.food.item_id;
        const cart = this.shopCart();
        if (cart && cart[category_id] && cart[category_id][item_id])
        {
            const values = [];
            Object.keys(cart[category_id][item_id]).forEach(item => {
                values.push(cart[category_id][item_id][item]);
            });
            values.forEach((item, index) => {
                retVal += item.num;
            });
        }

        return retVal;
    }

    // 移出购物车
    removeOutCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock)
    {
        if (this.foodNum() > 0)
        {
            this.cartService.reduceCart({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock });
            this.onCartChange.emit(null);
        }
    }

    // 加入购物车，计算按钮位置。
    addToCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, event)
    {
        this.cartService.addCart({ shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock });
        this.onCartChange.emit(null);
        const elLeft = event.target.getBoundingClientRect().left;
        const elBottom = event.target.getBoundingClientRect().bottom;
        this.showMoveDot.push(true);
        this.onShowMoveDot.emit({ 'showMoveDot': this.showMoveDot, 'elLeft': elLeft, 'elBottom': elBottom });
    }

    // 显示规格列表
    showChooseList(food)
    {
        this.onShowChooseList.emit(food);
    }

    // 点击多规格商品的减按钮，弹出提示
    async showReduceTip()
    {
        let toast = await this.toastCtrl.create({
            message: '多规格商品只能去购物车删除哦',
            duration: 2000,
            position: 'middle',
            cssClass: 'specs_reduce_tip'
            });
        toast.present();
    }

    @Input() food: any;
    @Input() shopId: string;
    @Output() onCartChange: EventEmitter<any> = new EventEmitter();
    @Output() onShowChooseList: EventEmitter<any> = new EventEmitter();
    @Output() onShowMoveDot: EventEmitter<any> = new EventEmitter();

    showMoveDot: any = [];
}