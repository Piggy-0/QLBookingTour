import { Component } from '@angular/core';
import { Tours } from '../../../Models/tours';
import { Vehicles } from '../../../Models/vehicles';
import { TourService } from '../../../Service/tour-service';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../../Service/vehicle-service';
import { OrderService } from '../../../Service/order-service';
import { userService } from '../../../Service/userService';
import { ReviewService } from '../../../Service/review-service';
import { Reviews } from '../../../Models/reviews';


@Component({
  selector: 'app-detail-tour',
  templateUrl: './detail-tour.component.html',
  styleUrl: './detail-tour.component.css'
})
export class DetailTourComponent {

  
  public tour: Tours;
  name: string = '';
  sdt: string = '';
  soLuong: number = 0;
  ngayKhoiHanh: Date;
  idTour: number = 0;
  idXe: number = 0;
  Gia: number = 0;
  DSVehicle: Vehicles[] = [];
  dangThemSua:boolean= false;
  user_id: number;
  customer_name:string;
  reviews: Reviews[] = [];
  newReview: string = '';
  rating: number = 0;
  selectedReview: any= null;
  contenReview: string = '';
  ratingReview: number;


  constructor(private tourService:TourService, private route: ActivatedRoute, private router:Router,
    private vehiclesService:VehicleService, private donhangService:OrderService,
    public userService:userService,
    private reviewService: ReviewService,){}

  ngOnInit() {
    const tourId = Number(this.route.snapshot.paramMap.get('id'));
    if (tourId) {
      this.idTour = tourId;
      this.tourDetail(tourId);
      this.loadReviews(tourId);
    } else {
      console.error("Lỗi! Tour ID is invalid or not found.");
    }
    this.layDSVehicles();
    this.loadUser(this.user_id);
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

  //lấy danh sách xe
  layDSVehicles(){
    this.vehiclesService.getVehicles().subscribe(data => {
      this.DSVehicle = data;
    });
  }

  // Đặt tour
  layTour() {
    if (!this.tour.Id) {
      console.error('ID Tour is required');
    }
    return this.tourService.getTourDetails(this.idTour);
  }

  updateGia() {
    if (this.tour && this.soLuong) {
      this.Gia = this.soLuong * this.tour.Gia;
    }
  }

  chonTour(tour: Tours) {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đặt tour.');
      this.router.navigate(['/login']);
      return;
    }
    this.tour = tour;
    this.idTour = tour.Id;
    this.updateGia(); // cập nhật giá trước khi hiển thị modal
  }
  
  themDonhang() {
    // Kiểm tra người dùng đã đăng nhập hay chưa
    const currentUser = this.userService.getCurrentUser();
  
    if (!currentUser) {
      alert('Vui lòng đăng nhập để đặt tour.');
      this.router.navigate(['/login']);
      return;
    }

    this.user_id = currentUser.id;
    console.error('id', this.user_id);
  
    this.layTour().subscribe({
      next: (tour) => {
        this.tour = tour;
        this.updateGia();
  
        const val = {
          customer_id: this.user_id,  // nếu bảng đơn hàng tour có liên kết với user
          order_status: 'Chờ xác nhận',  // Cập nhật trạng thái đơn hàng ban đầu
          SoLuong: this.soLuong,
          NgayKhoiHanh: this.ngayKhoiHanh,
          IDTour: this.idTour,
          IDXe: this.idXe,
          Gia: this.Gia,
          Name: this.name, 
          sdt: this.sdt,
        };
        this.donhangService.addDsDonhang(val).subscribe({
          next: () => {
            alert('Đặt tour thành công!');
          },
          error: (error) => {
            console.error('Lỗi!', error);
          }
        });
      },
      error: (err) => {
        console.error('Không lấy được thông tin tour!', err);
      }
    });
  }
  

  //đóng hộp thoại
  dong(){
    this.dangThemSua=false;
    this.tourDetail(this.idTour);
  }

  
  loadUser(id:number){
    const currentUser = this.userService.getCurrentUser();  
    if (currentUser) {
      this.user_id = currentUser.id;  
      this.customer_name = currentUser.username;
    } else {
      console.log('Không có người dùng đăng nhập');
      
    }
  }

    // Load Reviews
  loadReviews(product_id) {
    this.reviewService.getReviewsByProduct(product_id).subscribe({
      next: (data) => {
        this.reviews = data;
        console.log('Reviews loaded:', this.reviews);
        
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }
  
   // Submit a Review
   submitReview() {
    if (!this.newReview || this.rating === 0) {
      alert('Please provide a review and a rating.');
      return;
    }

    const reviewData = {
      product_id: this.idTour,
      user_id: this.user_id,
      content: this.newReview,
      rating: this.rating,
      create_at: new Date()
    };
    console.log('dataa',reviewData);

    this.reviewService.addReview(reviewData).subscribe({
      next: (response) => {
        alert('Review submitted successfully!');
        this.loadReviews(this.idTour); 
        this.newReview = ''; // Clear the review input
        this.rating = 0; // Reset rating
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        alert('Failed to submit review.');
      }
    });
  }

  deleteReview(reviewId: number): void {
    this.reviewService.deleteReview(reviewId).subscribe(
      () => {
        this.loadUser(this.user_id);
        this.loadReviews(this.idTour); 
      },
      (error) => {
        console.error('Error deleting review', error);
      }
    );
  }

  editReview(review: Reviews) {
    this.selectedReview = review;
    this.contenReview = review.content ;
    this.ratingReview = review.rating ;
    
  }

  suaReview() {
    if (!this.selectedReview || !this.selectedReview.id) {
      console.error('Danh mục chưa được chọn hoặc không hợp lệ.');
      return;
    }

    const val = { id: this.selectedReview.id, content: this.contenReview, rating: this.ratingReview };
    this.reviewService.updateReview(this.selectedReview.id, val).subscribe(
      response => {
        console.log('Sửa thành công:', response);
        alert('Sửa  thành công!');
        this.loadReviews(this.idTour);
      },
      error => {
        console.error('Có lỗi khi sửa!', error);
        if (error.error) {
          console.error('Chi tiết lỗi:', error.error);
        }
      }
    );
  }

}
