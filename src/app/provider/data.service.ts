import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';



@Injectable()
export class DataService {
    constructor(private http: HttpClient) {}

    getCity(type: string): any {
        return this.http.get('/api/cities' + `?type=${type}`);
    }

    getGuessCity(): Promise<any> {
        return this.getCity('guess').pipe(map(res => res[0])).toPromise();
    }

    getHotCity(): Promise<any> {
        return this.getCity('hot').pipe(map(res => res[0])).toPromise();
    }

    getGroupCity(): Promise<any> {
        return this.getCity('group').pipe(map(res => {
            let sortCities = [];
            var data = res[0].data;
            for (let i = 65; i <= 90; i++) {
              if (data[String.fromCharCode(i)]) {
                sortCities.push({ letter: String.fromCharCode(i), cities: data[String.fromCharCode(i)] });
              }
            }
            return sortCities;
          })).toPromise();
    }

    getCityById(type: string, id: string): Promise<any> {
        return this.http.get('/api/cities' + `?id=${id}`).pipe(map(res => {
            for(const item of (res as Array<any>)) {
                if (item.type == type) {
                    return item.data;
                }
            }
            return null;
        })).toPromise();
    }

    searchPlace(cityId: string, keyword: string): Promise<any> {
        //  HttpParams是一个不可变对象，每次set都会返回一个新的对象，所以需要链式调用
        let params = new HttpParams()
        // .set('type', 'search')
        // .set('city_id', cityId)
        // .set('keyword', keyword);
        return this.http.get('/api/pois').toPromise();
    }

    getPoisGeohash(geohash: string): Promise<any>
    {
        return this.http.get('/api/pois' + `?geohash=${geohash}`).pipe(map(res => res[0])).toPromise();
    }

    getMsiteFoodTypes(geohash: string): Promise<any>
    {
        return this.http.get('/api/index_entry').toPromise();
    }

    getShopList(geohash: string): Promise<any>
    {
        return this.http.get('/api/restaurants').toPromise();
    }

    async getShopDetails(shopId: string, geohash: string): Promise<any>
    {
        return await this.http.get('/api/shop' + `?id=${shopId}`).pipe(map(res => res[0])).toPromise();
    }

    async getFoodMenu(shopId: string): Promise<any>
    {
        return await this.http.get('/api/foodmenu' + `?restaurant_id=${shopId}`).toPromise();
    }

    async getRatingList(shopId: string): Promise<any>
    {
        return await this.http.get('/api/ratinglist').toPromise();
    }

    async getRatingScores(shopId: string): Promise<any>
    {
        return await this.http.get('/api/ratingscores').toPromise();
    }
}
