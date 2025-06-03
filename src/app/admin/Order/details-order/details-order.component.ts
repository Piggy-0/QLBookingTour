import { Component } from '@angular/core';
import { Orders } from '../../../Models/orders';
import { Tours } from '../../../Models/tours';
import { Vehicles } from '../../../Models/vehicles';
import { OrderService } from '../../../Service/order-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../../Service/tour-service';
import { VehicleService } from '../../../Service/vehicle-service';

@Component({
  selector: 'app-details-order',
  templateUrl: './details-order.component.html',
  styleUrl: './details-order.component.css'
})
export class DetailsOrderComponent {


  
  public donhang: Orders;
  tour: Tours;
  vehicles: Vehicles;

  constructor(
    private donHangService: OrderService,
    private route: ActivatedRoute,
    private tourService: TourService,
    private vehiclesService: VehicleService,
    private router:Router
  ) {}

  ngOnInit() {
    const donhangId = Number(this.route.snapshot.paramMap.get('id'));
    if (donhangId) {
      this.donhangDetail(donhangId);
    } else {
      console.error("Lỗi! Tour ID is invalid or not found.");
    }
  }

  donhangDetail(id: number) {
    this.donHangService.getDonHangDetails(id)
      .subscribe({
        next: (donhang) => {
          this.donhang = donhang;

          this.tourService.getTourDetails(donhang.IDTour).subscribe(tour => {
            this.donhang.IDTour = tour.Ten;
          });

          this.vehiclesService.getVehiclesDetails(donhang.IDXe).subscribe(vehicle => {
            this.donhang.IDXe = vehicle.Name;
          });
        },
        error: (err) => {
          console.error('Error fetching tour details:', err);
        }
      });
  }

  goBack() {
    this.router.navigate([`/admin/orders/list`]); // Điều hướng về danh sách với ID   
  }

  goBack2() {
    this.router.navigate([`/admin/index`]); 
  }
}
