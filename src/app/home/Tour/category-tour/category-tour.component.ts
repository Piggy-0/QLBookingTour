import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../../Service/tour-service';
import { Tours } from '../../../Models/tours';

@Component({
  selector: 'app-category-tour',
  templateUrl: './category-tour.component.html',
  styleUrl: './category-tour.component.css'
})
export class CategoryTourComponent implements OnInit{

  constructor(private tourService: TourService, private route: ActivatedRoute) {}

  tours:Tours[] = [];

  ngOnInit(){
    const DMId = Number(this.route.snapshot.paramMap.get('id'));
    this.layTourByDM(DMId);
  }

  layTourByDM(id:number){
    this.tourService.getTourByIdDM(id)
      .subscribe({
        next: (tours) => {
          this.tours = tours;
          this.tours.forEach(tour => {
            tour.PathAnh = this.tourService.PhotosUrl + "/" + tour.Anh;
          });
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
  }
}
