import { OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "./app.service";

export class UserInfo implements OnInit, OnDestroy
{
    constructor(public appService: AppService)
    {
        this.userId = localStorage.getItem('userId');
        this.unSubEvent = this.appService.userInfoEvent.subscribe(res => {
            this.userId = localStorage.getItem('userId');
            this.ngOnInit();
        });
    }

    ngOnInit(): void
    {
    }
    
    ngOnDestroy(): void
    {
        if (this.unSubEvent)
            this.unSubEvent.unsubscribe();
    }
    
    public userId: string;
    private unSubEvent: Subscription;
}