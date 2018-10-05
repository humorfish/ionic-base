import { Component, Input } from '@angular/core';

@Component({
  selector: 'rating-star',
  templateUrl: 'rating-star.html',
  styleUrls: ['rating-star.scss']
})
export class RatingStarComp {
  @Input() rating: number;
}
