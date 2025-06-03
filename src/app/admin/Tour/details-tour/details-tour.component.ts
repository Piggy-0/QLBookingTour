import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../../Service/tour-service';
import { Tours } from '../../../Models/tours';

@Component({
  selector: 'app-details-tour',
  templateUrl: './details-tour.component.html',
  styleUrl: './details-tour.component.css'
})
export class DetailsTourComponent {

  public tour: Tours;
  idTour: number = 0;


  constructor(private tourService:TourService, private route: ActivatedRoute, private router:Router){}
  
  ngOnInit() {
    const tourId = Number(this.route.snapshot.paramMap.get('id'));
    if (tourId) {
      this.idTour = tourId;
      this.tourDetail(tourId);
    } else {
      console.error("Lỗi! Tour ID is invalid or not found.");
    }
  }
  //Lấy tour bằng id
  tourDetail(id: number) {
    this.tourService.getTourDetails(id)
      .subscribe({
        next: (tour) => {
          this.tour = tour;
          this.tour.PathAnh = this.tourService.PhotosUrl + "/" + this.tour.Anh;
        },
        error: (err) => {
          console.error('Error fetching tour details:', err);
        }
      });
  }

  
  goBack() {
    this.router.navigate([`/admin/tours/list/`, 0]); // Điều hướng về danh sách với ID   
  }

  goBack2() {
    this.router.navigate([`/admin/index`]); 
  }
}
