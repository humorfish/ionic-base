import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
        return null;
    }
}
