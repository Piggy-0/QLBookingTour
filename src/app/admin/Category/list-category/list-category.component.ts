import { Component } from '@angular/core';
import { Categories } from '../../../Models/categories';
import { CategoriesService } from '../../../Service/categories-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.css'
})
export class ListCategoryComponent {


  
  DsDanhmuc: any[] = [];
  tenDanhMuc: string = '';
  moTaDanhMuc: string = '';
  category: Categories;
  them: boolean = false;
  selectedDanhMuc: any = null;

  constructor(private http: CategoriesService, private router: Router) {
  }

  ngOnInit(): void {
    this.DsDanhMucSp();
  }

  DsDanhMucSp() {
    this.http.getDsdanhmuc().subscribe(data => {
      this.DsDanhmuc = data;
    });
  }

  xoaDsDanhmuc(category: Categories) {
    this.http.deleteDsdanhmuc(category.category_id).subscribe(
      (data) => {
        console.log(data);
        this.DsDanhMucSp();
      }
    );
  }

  editDanhMuc(category: Categories) {
    this.selectedDanhMuc = category;
    this.tenDanhMuc = category ? category.name : '';
    this.moTaDanhMuc = category ? category.description : '';
  }

  suaDanhMuc() {
    if (!this.selectedDanhMuc || !this.selectedDanhMuc.category_id) {
      console.error('Danh mục chưa được chọn hoặc không hợp lệ.');
      return;
    }

    const val = { category_id: this.selectedDanhMuc.category_id, name: this.tenDanhMuc, description: this.moTaDanhMuc };
    this.http.updateDsDanhMuc(this.selectedDanhMuc.category_id, val).subscribe(
      response => {
        this.DsDanhMucSp();
        console.log('Sửa thành công:', response);
        alert('Sửa danh mục thành công!');
      },
      error => {
        console.error('Có lỗi khi sửa danh mục!', error);
        if (error.error) {
          console.error('Chi tiết lỗi:', error.error);
        }
      }
    );
  }

  dong() {
    this.them = false;
    this.DsDanhMucSp();
  }
}
