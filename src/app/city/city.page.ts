import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../provider';
import { AppService } from '../provider/app.service';

@Component({ selector: 'page-city', templateUrl: 'city.page.html', styleUrls: ['city.page.scss'] })
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
        private appService: AppService,
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

    clearAll() {
        localStorage.removeItem('placeHistory');
        this.placeList = [];
    }

    searchPlace() {
        if (!this.search)
            return;

        this.historyTitle = true;

        // this.dataSvc.searchPlace();
    }

    toMiste(place: any) {
        this.setSearchStorage(place);
        this.appService.geohash = place.geohash;
        this.router.navigateByUrl('/app/tab/(msite:msite)?geohash=' + place.geohash);
    }

    setSearchStorage(place: any) {
        let history = localStorage.getItem('placeHistory');
        let choosePlace = place;
        if (history) {
            let checkrepeat = false;
            this.placeHistory = JSON.parse(history);
            this.placeHistory.forEach(item => {
                if (item.geohash === place.geohash) {
                    checkrepeat = true;
                }
            });
            if (!checkrepeat) {
                this.placeHistory.push(choosePlace);
            }
        } else {
            this.placeHistory.push(choosePlace);
        }
        localStorage.setItem('placeHistory', JSON.stringify(this.placeHistory));
    }
}