import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../provider';

@Component({selector: 'page-city', templateUrl: 'city.page.html', styleUrls: ['city.page.scss']})
export class CityPage implements OnInit {

    search: string;
    guessCity: string;
    guessCityId: string;
    guessCityType: string;
    placeList: any[] = [];
    placeNone: boolean;
    placeHistory: any[] = [];
    historyTitle: boolean = true;

    constructor(
        private activedRoute: ActivatedRoute, 
        private router: Router,
        private dataSvc: DataService) {
        this.guessCityId = this.activedRoute.snapshot.paramMap.get('id');
        this.guessCityType = this.activedRoute.snapshot.paramMap.get('type');
        this.getCityById(this.guessCityType, this.guessCityId);
    }

    ngOnInit() {

    }

    getCityById(type: string, id: string) {
        this.dataSvc.getCityById(type, id)
            .then(res => this.guessCity = res.name)
            .catch(err => console.log(err));
    }

    goBack() {
        window.history.back();
    }

    searchPlace() {
        if (!this.search) 
            return;
        this.historyTitle = true;
        this.dataSvc.searchPlace();
    }
}