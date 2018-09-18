import { OnInit, Component } from "@angular/core";

@Component({
    selector: 'msite-page',
    templateUrl: 'msite.page.html',
    styleUrls: ['msite.page.scss']
})
export class MsitePage implements OnInit
{
    constructor()
    {}

    ngOnInit()
    {}

    title: string = '';
}