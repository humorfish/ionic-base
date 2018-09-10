import { Component, OnInit } from '@angular/core';
import { DataService } from '../provider';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

	guessCity: string;
	guessCityId: string;

	hotCities: Array<any> = [];
	groupCities: Array<any> = [];

	constructor(public dataSvc: DataService, private router: Router) {
		// this.router.navigate(['/login']);
	}

	ngOnInit() {
		this.getCurrentCity();
		this.getHotCity();
		this.getGroupCity();
	}

	getCurrentCity() {
		this.dataSvc.getGuessCity()
			.then(res => {
				console.log(res);
				this.guessCity = res.data.name;
				this.guessCityId = res.data.id;
			})
			.catch(err => {
				console.log(err);
				
				this.guessCity = '无数据';
				this.guessCityId = '';
			});
	}

	getHotCity() {
		this.dataSvc.getHotCity()
			.then(res => {
				if (Array.isArray(res.data)) {
					this.hotCities = res.data.map(city => {
						return { name: city.name, id: city.id };
					});
				}
			})
			.catch(err => {
				console.log(err);				
			});
	}

	getGroupCity() {
		this.dataSvc.getGroupCity()
			.then(res => {
				this.groupCities = res;
			})
			.catch(err => {
				console.log(err);
			});
	}

}
