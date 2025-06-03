import { Component, Input, OnInit } from '@angular/core';
import { Tours } from '../../../Models/tours';
import { TourService } from '../../../Service/tour-service';

@Component({
  selector: 'app-create-tour',
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.css'
})
export class CreateTourComponent {
  id: any;
  ten:any;
  noixuatphat:any;
  noiden:any;
  thoigian:any;
  anh:any;
  loaiTour:any;
  @Input() tour:Tours;
  public message = null;

  constructor(private http: TourService){}

  ngOnInit(): void{
    this.ten = this.tour.Ten;
    this.noixuatphat = this.tour.NoiXuatPhat;
    this.noiden = this.tour.NoiDen;
    this.thoigian = this.tour.ThoiGian;
    this.anh = this.tour.Anh;

    if (this.anh){
      this.tour.PathAnh = this.http.PhotosUrl + "/" + this.anh;
    } else{
      this.tour.Anh = "com.jpg";
      this.tour.PathAnh = this.http.PhotosUrl + "/" + this.tour.Anh;
    }
  }

  createTour(){
    var val= {
      ten:this.ten,
      noixuatphat:this.noixuatphat,
      noiden:this.noiden,
      thoigian:this.thoigian,
      anh:this.tour.Anh
    };
    this.http.postTour(val).subscribe(res =>{
      alert('Thêm thành công');
    });
  }
  
  suaTour(id:number){
    var val = {
      id:this.tour.Id,
      ten:this.ten,
      noixuatphat:this.noixuatphat,
      noiden:this.noiden,
      thoigian:this.thoigian,
      anh:this.tour.Anh
    };
    this.http.updateTour(id, val).subscribe(res =>{
      alert('Sửa thành công');
    });
  }

  uploadPhoto(event:any){
    var file = event.target.files[0];
    const formData:FormData = new FormData();
    formData.append('uploadedFile', file, file.name);

    this.http.taiAnh(formData).subscribe((data:any) => {
      this.tour.Anh = data.toString();
      this.tour.PathAnh = this.http.PhotosUrl + "/" + this.tour.Anh;
    })
  }

}
