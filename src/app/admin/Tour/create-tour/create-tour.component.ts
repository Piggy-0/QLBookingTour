import { Component, Input } from '@angular/core';
import { Tours } from '../../../Models/tours';
import { Categories } from '../../../Models/categories';
import { TourService } from '../../../Service/tour-service';
import { CategoriesService } from '../../../Service/categories-service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-create-tour',
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.css'
})
export class CreateTourComponent {

  
  Ten: string = '';
  Noixuatphat: string = '';
  Noiden: string = '';
  Thoigian: string = '';
  Gia: number;
  anh: string = 'com.jpg';
  category_id: number ;
  @Input() tour:Tours;
  DsDanhmuc:Categories[] = [];
  public message = null;

  constructor(private tourService: TourService, private danhmucService: CategoriesService, private router: Router,
  ){}

  ngOnInit(): void{


    this.DsDanhMucSp();
  }

  DsDanhMucSp() {
    this.danhmucService.getDsdanhmuc().subscribe(data => {
      this.DsDanhmuc = data;
      console.log("Danh mục:", this.DsDanhmuc);
    });


  }

  createTour() {
    var val= {
      Ten:this.Ten,
      category_id: this.category_id,
      Noixuatphat:this.Noixuatphat,
      Noiden:this.Noiden,
      Thoigian:this.Thoigian,
      Gia:this.Gia,
      anh:this.anh
    };

    console.log(val);

    this.tourService.postTour(val).subscribe(res =>{
      alert('Thêm thành công');
      this.router.navigate(['/admin/tours/list']);
    }, err => {
      console.error('Error:', err);
      alert('Đã xảy ra lỗi trong khi tạo sản phẩm');
    });
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

}
