import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { DataService } from '../provider';

@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage implements OnInit {
  userName: string;
  userPwd: string;
  showPwd: boolean;
  captchaCodeImg: string;
  codeNumber: string;
  constructor(
    public location: Location,
    public dataService: DataService,
    public toastCtrl: ToastController,
    public renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
    this.userName = '';
    this.userPwd = '';
    this.showPwd = false;
    this.renderer.removeClass(this.el.nativeElement, 'ion-page-invisible');
    this.getCaptchaCode();
  }

  // 获取验证码
  getCaptchaCode() {
    
  }

  async toastTip(message: string) {
    let toast = await this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: 'middle'
      });
    toast.present();
  }

  logIn() {
    
  }
}
