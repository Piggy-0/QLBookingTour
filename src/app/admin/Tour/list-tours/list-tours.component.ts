import { Component, Input } from '@angular/core';
import { Tours } from '../../../Models/tours';
import { TourService } from '../../../Service/tour-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories } from '../../../Models/categories';
import { CategoriesService } from '../../../Service/categories-service';

@Component({
  selector: 'app-list-tours',
  templateUrl: './list-tours.component.html',
  styleUrl: './list-tours.component.css'
})
export class ListToursComponent {

    constructor(private tourService: TourService, private router:Router, private route: ActivatedRoute,  private danhmucService: CategoriesService) {}
  

    Ten: string = '';
    NoiXuatPhat: string = '';
    NoiDen: string = '';
    ThoiGian: string = '';
    Gia: number;
    anh: string = 'com.jpg';
    category_id: number ;
    @Input() tour:Tours;
    DsDanhmuc:Categories[] = [];
    selected_tour: Tours | null = null;

    DSTour: Tours[];
    tourSearch: any[] = [];
    dangThemSua:boolean= false;
    tieude:any;
    searchText: string = '';
    dangTimKiem: boolean = false;

    paginatedProducts: Tours[] = [];
    currentPage: number = 1;
    pageSize: number = 3; // Number of products per page
    totalPages: number = 0;
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.searchText = params['search'] || '';
        if (this.searchText) {
          this.timkiem();
        } else {
          this.layDSTourByIdDM();
        }
      });
      this.DsDanhMucSp();
    }    
  
    // layDSTour() {
    //   this.tourService.getTours().subscribe(data => {
    //     this.DSTour = data;
    //     this.tourSearch = this.DSTour;
    //     this.DSTour.forEach(tour => {
    //       tour.PathAnh = this.tourService.PhotosUrl + "/" + tour.Anh;
    //     });
    //     this.totalPages = Math.ceil(this.DSTour.length / this.pageSize);
    //     this.updatePagination(); 
    //   });
    // }
    
    layDSTourByIdDM(): void {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.category_id = id;
      console.log("Category ID:", id);
    
      if (this.category_id && this.category_id > 0) {
        // Gọi API lấy tour theo danh mục
        this.tourService.getTourByIdDM(this.category_id).subscribe(
          (data: Tours[]) => {
            this.DSTour = data;
            this.tourSearch = this.DSTour.map(tour => {
              tour.PathAnh = this.tourService.PhotosUrl + "/" + tour.Anh;
              return tour;
            });
            this.totalPages = Math.ceil(this.DSTour.length / this.pageSize);
            this.updatePagination();
          },
          (error) => {
            console.error('Lỗi khi tải tour theo danh mục:', error);
            this.tourSearch = [];
          }
        );
      } else {
        // Gọi API lấy tất cả tour
        this.tourService.getTours().subscribe(
          (data: Tours[]) => {
            this.DSTour = data;
            this.tourSearch = this.DSTour.map(tour => {
              tour.PathAnh = this.tourService.PhotosUrl + "/" + tour.Anh;
              return tour;
            });
            this.totalPages = Math.ceil(this.DSTour.length / this.pageSize);
            this.updatePagination();
          },
          (error) => {
            console.error('Lỗi khi tải tất cả tour:', error);
            this.tourSearch = [];
          }
        );
      }
    }
    

    // Xóa Tour
    xoaTour(id: number){
      if (confirm("Bạn có chắc chắn muốn xóa không?")){
        this.tourService.deleteTour(id).subscribe({
          next: () => {
            console.log('Xóa thành công.');
            this.layDSTourByIdDM();
          },
          error: (error) => {
            console.error('Xóa thất bại:', error);
          }
        });
      }
    }
  
    dong(){
      this.dangThemSua=false;
      this.layDSTourByIdDM();
    }
  
    timkiem() {
      this.dangTimKiem = true;
      if (this.searchText) {
        console.log('Tìm kiếm với từ khóa:', this.searchText);
        this.tourService.timkiem(this.searchText).subscribe({
          next: (tourSearch) => {
            console.log('Kết quả tìm kiếm:', tourSearch);
            if (tourSearch.length > 0) {
              this.tourSearch = tourSearch.map(tour => {
                tour.PathAnh = this.tourService.PhotosUrl + "/" + tour.Anh;
                return tour;
              });
              this.totalPages = Math.ceil(this.tourSearch.length / this.pageSize);
              this.currentPage = 1;
              this.updatePagination(); // Hiển thị phân trang cho kết quả tìm kiếm
            } else {
              console.log('Không tìm thấy tour nào.');
              this.tourSearch = [];
              this.paginatedProducts = [];
              this.totalPages = 0;
            }
          },
          error: (err) => {
            console.error('Lỗi khi tìm kiếm tour:', err);
            this.tourSearch = [];
            this.paginatedProducts = [];
            this.totalPages = 0;
          }
        });
      } else {
        console.log('Vui lòng nhập từ khóa tìm kiếm.');
        this.dangTimKiem = false;
      }
    }
    

    get photosUrl(): string {
      return this.tourService.PhotosUrl;
    }
  
    uploadPhoto(event: any) {
      var file = event.target.files[0];
      if (!file) {
        alert('Vui lòng chọn một tệp!');
        return;
      }
    
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
    
      this.tourService.taiAnh(formData).subscribe((data: any) => {
        // Assuming 'data' is the image name or URL returned from the backend
        if (data) {
          this.anh = data.toString();  // Store the image URL returned by the backend
          console.log('Response data:', data);
          // Make sure the photosUrl is also correctly set
          this.tour.PathAnh = this.tourService.PhotosUrl + "/" + this.anh;
        } else {
          alert('Lỗi tải ảnh');
        }
      }, error => {
        console.error('Lỗi upload ảnh:', error);
        alert('Không thể tải ảnh lên');
      });
    }


    DsDanhMucSp() {
      this.danhmucService.getDsdanhmuc().subscribe(data => {
        this.DsDanhmuc = data;
        console.log("Danh mục:", this.DsDanhmuc);
      });
  
  
    }
    editProduct(tour: Tours) {
      if (!tour) {
        console.error('Tour không hợp lệ:', tour);
        return;
      }
      this.selected_tour = tour; // Create a copy to avoid directly modifying the product
      this.Ten = this.selected_tour.Ten;
      this.category_id = this.selected_tour.category_id;
      this.NoiXuatPhat = this.selected_tour.NoiXuatPhat;
      this.NoiDen = this.selected_tour.NoiDen;
      this.ThoiGian = this.selected_tour.ThoiGian 
      this.Gia = this.selected_tour.Gia;
      this.anh = this.selected_tour.Anh

    
      // Update PathAnh to display the product's image
      if (this.selected_tour && this.selected_tour.Anh) {
        this.selected_tour.PathAnh = this.tourService.PhotosUrl + "/" + this.selected_tour.Anh;
      } else {
        this.selected_tour.PathAnh = ''; // Default empty or placeholder if no image
      }
    }
    
    
    
    suaTour() {
      if (!this.selected_tour || !this.selected_tour.Id) {
        console.error('product chưa được chọn hoặc không hợp lệ.');
        return;
      }
    
      const val = {
        Id: this.selected_tour.Id,
        Ten:this.Ten,
        category_id: this.category_id,
        Noixuatphat:this.NoiXuatPhat,
        Noiden:this.NoiDen,
        Thoigian:this.ThoiGian,
        Gia:this.Gia,
        anh:this.anh
      };
      console.log(val);
    
      this.tourService.updateTour(this.selected_tour.Id, val).subscribe(
        response => {
          this.layDSTourByIdDM();  // Reload products after update
          console.log('Sửa thành công:', response);
          alert('Sửa tour thành công!');
        },
        error => {
          console.error('Có lỗi khi sửa tour!', error);
          if (error.error) {
            console.error('Chi tiết lỗi:', error.error);
          }
        }
      );
    }

    updatePagination(): void {
      const dataSource = this.tourSearch.length > 0 ? this.tourSearch : this.DSTour;
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.paginatedProducts = dataSource.slice(start, end);
    }
    
    
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updatePagination();
      }
    }
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagination();
      }
    }

}
